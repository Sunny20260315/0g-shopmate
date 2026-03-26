# 0G 存储交互封装指南

## 概述

完整的 0G 分布式存储交互封装，包括：

- ✅ 高级存储客户端（支持文件、文本、JSON 上传）
- ✅ 数据库实体（TypeORM）用于元数据持久化
- ✅ 业务逻辑服务层（处理上传、验证、查询）
- ✅ REST API 控制器（文件上传、交易验证）
- ✅ 完整的错误处理和日志记录

## 架构设计

```
packages/common/src/0g/
├── client.ts              # 原始 SDK 包装器（文件路径上传）
├── storage.ts             # 高级存储客户端（多种数据格式支持）
└── index.ts               # 统一导出

apps/backend/src/
├── entities/
│   └── file.entity.ts     # 文件元数据实体（TypeORM）
├── services/
│   └── storage.service.ts # 业务逻辑服务
├── controllers/
│   └── storage.controller.ts # REST API 控制器
└── modules/
    └── storage.module.ts  # NestJS 模块注册
```

## 核心功能

### 1. 高级存储客户端

#### 基础文件上传

```typescript
import { ZgStorageClient } from '@shopmate/common';

const client = new ZgStorageClient({
  rpcUrl: 'https://rpc-testnet.0g.ai',
  indexerUrl: 'https://storage-testnet.0g.ai:3000',
  privateKey: process.env.PRIVATE_KEY!,
});

// 上传文件
const result = await client.uploadFile('/path/to/file.txt');
console.log(result.rootHash); // Merkle root hash
console.log(result.txHash); // 交易哈希
```

#### 上传二进制数据

```typescript
const buffer = Buffer.from('binary data');
const result = await client.uploadBuffer(buffer, 'filename.bin');
```

#### 上传文本数据

```typescript
const text = 'Hello, 0G Storage!';
const result = await client.uploadText(text, 'message.txt');
```

#### 上传 JSON 数据

```typescript
const data = { user: 'alice', message: 'Hello' };
const result = await client.uploadJSON(data, 'data.json');
```

#### 从环境变量创建客户端

```typescript
// 自动读取环境变量
const client = createZgStorageClientFromEnv();
```

### 2. 后端服务层

#### 初始化服务

```typescript
import { StorageService } from './services/storage.service';

constructor(private storageService: StorageService) {}
```

#### 上传文件

```typescript
const fileEntity = await this.storageService.uploadFile(fileBuffer, 'document.pdf', userId, {
  description: 'User document',
});

console.log(fileEntity.id); // UUID
console.log(fileEntity.rootHash); // Merkle root
console.log(fileEntity.txHash); // 交易哈希
```

#### 上传聊天记录

```typescript
const messages = [
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' },
];

const fileEntity = await this.storageService.uploadChatHistory(messages, userId, sessionId);
```

#### 验证交易

```typescript
const status = await this.storageService.verifyTransaction(txHash);
// { status: 'pending' | 'success' | 'failed', confirmations?: number }
```

#### 批量上传

```typescript
const files = [
  { buffer: buf1, fileName: 'file1.txt' },
  { buffer: buf2, fileName: 'file2.pdf' },
];

const results = await this.storageService.uploadMultiple(files, userId);
```

### 3. REST API 接口

所有 API 都在 `/api/v1/storage` 前缀下。

#### 上传文件 (表单)

```bash
curl -X POST http://localhost:3001/api/v1/storage/upload \
  -F "file=@document.pdf" \
  -F "userId=user123"
```

#### 上传文本

```bash
curl -X POST http://localhost:3001/api/v1/storage/upload-text \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, 0G!",
    "fileName": "message.txt",
    "userId": "user123"
  }'
```

#### 上传 JSON

```bash
curl -X POST http://localhost:3001/api/v1/storage/upload-json \
  -H "Content-Type: application/json" \
  -d '{
    "data": { "name": "Alice", "age": 30 },
    "fileName": "profile.json",
    "userId": "user123"
  }'
```

#### 上传聊天记录

```bash
curl -X POST http://localhost:3001/api/v1/storage/upload-chat-history \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Tell me a story" },
      { "role": "assistant", "content": "Once upon a time..." }
    ],
    "userId": "user123",
    "sessionId": "session456"
  }'
```

#### 验证交易

```bash
curl -X GET http://localhost:3001/api/v1/storage/verify/0xabcd1234...
```

#### 获取钱包信息

```bash
curl -X GET http://localhost:3001/api/v1/storage/wallet-info
```

#### 获取文件状态

```bash
curl -X GET http://localhost:3001/api/v1/storage/status/file-uuid
```

## API 响应格式

### 成功响应

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileName": "document.pdf",
    "fileSize": 1024000,
    "rootHash": "0x...",
    "merkleRoot": "0x...",
    "txHash": "0x...",
    "status": "pending",
    "createdAt": "2026-03-24T10:30:00Z"
  }
}
```

### 错误响应

```json
{
  "success": false,
  "error": "File not found or invalid format"
}
```

## 环境变量配置

在 `.env.local` 中配置：

```env
# 0G RPC 配置
NEXT_PUBLIC_0G_CHAIN_RPC=https://rpc-testnet.0g.ai
NEXT_PUBLIC_0G_STORAGE_RPC=https://storage-testnet.0g.ai:3000

# Web3 钱包配置
PRIVATE_KEY=your_private_key_here

# 可选
ZG_RPC_URL=...
ZG_INDEXER_URL=...
ZG_PRIVATE_KEY=...
```

## 数据库集成

### TypeORM 实体

`FileEntity` 包含以下字段：

| 字段          | 类型         | 说明                     |
| ------------- | ------------ | ------------------------ |
| id            | UUID         | 唯一标识符               |
| fileName      | varchar(255) | 文件名                   |
| mimeType      | varchar(50)  | MIME 类型                |
| fileSize      | integer      | 文件大小（字节）         |
| rootHash      | varchar(66)  | Merkle root hash         |
| merkleRoot    | varchar(66)  | 默克尔根                 |
| txHash        | varchar(255) | 挂账交易哈希             |
| userId        | UUID         | 用户 ID                  |
| metadata      | JSON         | 自定义元数据             |
| status        | varchar(50)  | pending/confirmed/failed |
| confirmations | integer      | 交易确认数               |
| createdAt     | timestamp    | 创建时间                 |
| updatedAt     | timestamp    | 更新时间                 |
| isEncrypted   | boolean      | 是否加密                 |
| encryptionKey | varchar(255) | 加密密钥                 |

### 数据库索引

自动创建的索引：

- `(rootHash, userId)` - 快速查询用户文件
- `(txHash)` - 交易查询
- `(createdAt)` - 时间序列查询

## 集成示例

### 在聊天服务中存储消息历史

```typescript
// apps/backend/src/modules/chat/chat.service.ts
import { StorageService } from '../../services/storage.service';

@Injectable()
export class ChatService {
  constructor(private storageService: StorageService) {}

  async saveMessageHistory(messages: Message[], userId: string, sessionId: string) {
    // 保存到 0G 存储
    return await this.storageService.uploadChatHistory(
      messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
      })),
      userId,
      sessionId
    );
  }
}
```

### 在控制器中处理文件上传

```typescript
// apps/backend/src/controllers/api.controller.ts
import { StorageService } from '../services/storage.service';

@Controller('api/v1')
export class ApiController {
  constructor(private storageService: StorageService) {}

  @Post('documents')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string) {
    return await this.storageService.uploadFile(file.buffer, file.originalname, userId);
  }
}
```

### 在前端调用 API

```typescript
// apps/frontend/lib/storage.ts
export async function uploadFile(file: File, userId: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  const response = await fetch('/api/v1/storage/upload', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

export async function uploadChatHistory(messages: Message[], userId: string, sessionId: string) {
  const response = await fetch('/api/v1/storage/upload-chat-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userId, sessionId }),
  });

  return response.json();
}

// 使用
async function handleChatEnd(userId: string) {
  const messages = getConversationHistory();
  const result = await uploadChatHistory(messages, userId, sessionId);
  console.log('Chat saved:', result.data.rootHash);
}
```

## 错误处理

所有方法都会抛出有意义的错误：

```typescript
try {
  await client.uploadFile('/path/to/file');
} catch (error) {
  if (error.message.includes('File not found')) {
    // 处理文件未找到
  } else if (error.message.includes('Upload failed')) {
    // 处理上传失败
  } else if (error.message.includes('Merkle tree')) {
    // 处理默克尔树生成失败
  }
}
```

## 实用工具函数

### 计算文件哈希

```typescript
import { StorageService } from './services/storage.service';

const fileHash = StorageService.calculateHash(buffer);
```

### 验证文件完整性

```typescript
const isValid = StorageService.verifyFileIntegrity(buffer, expectedHash);
```

### 获取 MIME 类型

```typescript
const mimeType = fileService.getMimeType('document.pdf');
// 返回: 'application/pdf'
```

## 最佳实践

1. **错误处理**: 总是使用 try-catch 包装上传操作
2. **环境变量**: 不要在代码中硬编码密钥，使用环境变量
3. **文件验证**: 上传前验证文件大小和类型
4. **交易确认**: 在关键操作中验证交易确认数
5. **日志记录**: 使用提供的 Logger 记录所有存储操作
6. **元数据**: 为文件添加有意义的元数据便于后续查询

## 下一步

- [ ] 实现数据库 TypeORM 配置
- [ ] 添加文件加密功能
- [ ] 实现文件下载和解密
- [ ] 添加访问控制和权限管理
- [ ] 实现文件过期和清理策略
- [ ] 集成 IPFS 作为备份存储
