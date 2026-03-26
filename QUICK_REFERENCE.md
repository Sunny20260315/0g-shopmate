# 0G 存储快速参考指南

## 🎯 核心概念

0G 存储是一个分布式存储网络，通过在后端应用中集成本封装，你可以：

- ✅ 将聊天记录、用户数据存储在链上（不可篡改）
- ✅ 生成 Merkle 树验证数据完整性
- ✅ 获取交易哈希用于追踪证明
- ✅ 支持多种数据格式（文件、文本、JSON）

## 📦 三层导入方式

### 方式 1：直接使用高级客户端（推荐用于脚本/工具）

```typescript
import { ZgStorageClient, createZgStorageClientFromEnv } from '@shopmate/common';

const client = createZgStorageClientFromEnv();
const result = await client.uploadText('Hello', 'test.txt');
```

### 方式 2：在服务中注入（推荐用于后端）

```typescript
import { StorageService } from '../services/storage.service';

@Injectable()
export class MyService {
  constructor(private storageService: StorageService) {}

  async saveData() {
    return await this.storageService.uploadJSON(data, 'file.json');
  }
}
```

### 方式 3：通过 REST API（推荐用于前端）

```typescript
// 前端
const response = await fetch('/api/v1/storage/upload-json', {
  method: 'POST',
  body: JSON.stringify({ data, fileName: 'file.json' }),
});
```

## 🔑 快速命令参考

### 环境变量设置

```bash
export NEXT_PUBLIC_0G_CHAIN_RPC=https://rpc-testnet.0g.ai
export NEXT_PUBLIC_0G_STORAGE_RPC=https://storage-testnet.0g.ai:3000
export PRIVATE_KEY=your_private_key
```

### 启动后端

```bash
cd apps/backend
pnpm dev
```

### 测试端点

| 功能         | 命令                                                                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 获取钱包信息 | `curl http://localhost:3001/api/v1/storage/wallet-info`                                                                                                                                         |
| 上传文本     | `curl -X POST http://localhost:3001/api/v1/storage/upload-text -H "Content-Type: application/json" -d '{"content":"test","fileName":"file.txt"}'`                                               |
| 上传 JSON    | `curl -X POST http://localhost:3001/api/v1/storage/upload-json -H "Content-Type: application/json" -d '{"data":{"key":"value"},"fileName":"data.json"}'`                                        |
| 上传聊天     | `curl -X POST http://localhost:3001/api/v1/storage/upload-chat-history -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"hi"}],"userId":"123","sessionId":"456"}'` |
| 验证交易     | `curl http://localhost:3001/api/v1/storage/verify/0xTxHash`                                                                                                                                     |

## 📝 常见场景代码片段

### 保存聊天记录

```typescript
await storageService.uploadChatHistory(
  [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
  ],
  userId,
  sessionId
);
```

### 保存用户数据

```typescript
await storageService.uploadJSON(
  { name: 'Alice', email: 'alice@example.com', preferences: {} },
  `user_${userId}.json`,
  userId
);
```

### 批量上传

```typescript
await storageService.uploadMultiple(
  [
    { buffer: buf1, fileName: 'file1.txt' },
    { buffer: buf2, fileName: 'file2.pdf' },
  ],
  userId
);
```

### 验证上传状态

```typescript
const status = await storageService.verifyTransaction(txHash);
if (status.status === 'success') {
  console.log('Upload confirmed!');
}
```

### 计算文件哈希

```typescript
const hash = StorageService.calculateHash(buffer);
const isValid = StorageService.verifyFileIntegrity(buffer, expectedHash);
```

## 🎨 完整工作流示例

```typescript
// 1. 上传数据
const fileEntity = await storageService.uploadJSON({ userId, data }, 'data.json', userId);

console.log('Root Hash:', fileEntity.rootHash);
console.log('Transaction:', fileEntity.txHash);

// 2. 保存文件 ID 到数据库（可选）
await fileRepository.save({
  id: fileEntity.id,
  userId,
  rootHash: fileEntity.rootHash,
  txHash: fileEntity.txHash,
  status: 'pending',
});

// 3. 稍后验证交易
const status = await storageService.verifyTransaction(fileEntity.txHash);
if (status.status === 'success') {
  // 更新文件状态为已确认
  await fileRepository.update(fileEntity.id, { status: 'confirmed' });
}
```

## 📊 默克尔树和根哈希

每次上传都会自动生成默克尔树：

- **Merkle Root**: 文件数据的哈希树根，用于验证数据完整性
- **Root Hash**: Merkle Root 的 16 进制表示
- **Tx Hash**: 上传交易的区块链交易哈希，用于追踪和验证

```typescript
const result = await client.uploadText('data', 'file.txt');
console.log(result.merkleRoot); // 根哈希
console.log(result.txHash); // 交易哈希
console.log(result.fileSize); // 文件大小
console.log(result.rootHash); // Merkle root
```

## 🛡️ 最佳实践

1. **总是处理错误**

   ```typescript
   try {
     await uploadFile();
   } catch (error) {
     logger.error('Upload failed:', error);
   }
   ```

2. **验证网络状态**

   ```typescript
   const info = await storageService.getWalletInfo();
   if (info.balance === '0') {
     throw new Error('Insufficient balance');
   }
   ```

3. **为关键数据添加元数据**

   ```typescript
   await storageService.uploadJSON(data, 'important.json', userId); // 自动记录 userId、timestamp 等
   ```

4. **异步处理大量上传**

   ```typescript
   const results = await Promise.allSettled(
     files.map((f) => storageService.uploadFile(f.buffer, f.name, userId))
   );
   ```

5. **定期检查交易状态**
   ```typescript
   setInterval(async () => {
     const pending = await db.files.find({ status: 'pending' });
     for (const file of pending) {
       const status = await storageService.verifyTransaction(file.txHash);
       if (status.status !== 'pending') {
         await db.files.update(file.id, { status: status.status });
       }
     }
   }, 30000); // 每 30 秒检查一次
   ```

## 🔄 请求/响应格式

### 请求示例

```json
{
  "content": "Hello, World!",
  "fileName": "message.txt",
  "userId": "user123"
}
```

### 成功响应

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileName": "message.txt",
    "fileSize": 13,
    "rootHash": "0x...",
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
  "error": "Missing required fields: content, fileName"
}
```

## 🚨 故障排除

| 问题                                          | 原因                        | 解决               |
| --------------------------------------------- | --------------------------- | ------------------ |
| "Missing required environment variables"      | 缺少 RPC/Indexer URL 或私钥 | 设置 `.env.local`  |
| "Upload failed: Error generating Merkle tree" | 文件损坏                    | 检查文件内容       |
| "Upload failed: Upload error"                 | 网络或节点问题              | 重试或更换 RPC     |
| "Insufficient balance"                        | 钱包余额为 0                | 获取测试网 ZG 代币 |
| "File not found"                              | 文件路径错误                | 检查文件是否存在   |

## 📚 相关文件

- 📖 [详细集成指南](./docs/0G_STORAGE_INTEGRATION.md)
- 📋 [实施总结](./0G_STORAGE_SUMMARY.md)
- ⚙️ [设置说明](./STORAGE_SETUP.md)
- 💡 [集成示例](./apps/backend/src/examples/storage-integration-examples.ts)

## 🔗 有用的链接

- [0G Foundation 官网](https://www.0g.ai/)
- [0G 文档](https://docs.0g.ai/)
- [0G Testnet 水龙头](https://www.0g.ai/)
- [0G 浏览器](https://testnet.explorer.0g.ai/)

---

**提示**: 收藏此页面以便快速查阅！💡
