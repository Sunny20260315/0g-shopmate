# 0G 存储集成清单

## 📋 集成前检查

### 依赖确认

```bash
# 后端需要的额外包
pnpm add -w @nestjs/platform-express  # 文件上传
pnpm add -w @nestjs/swagger           # API 文档（已有）
pnpm add -w typeorm                   # ORM
pnpm add -w @nestjs/typeorm           # NestJS TypeORM
```

### 环境变量配置

创建 `.env.local`:

```env
# 0G 网络配置
NEXT_PUBLIC_0G_CHAIN_RPC=https://rpc-testnet.0g.ai
NEXT_PUBLIC_0G_STORAGE_RPC=https://storage-testnet.0g.ai:3000

# 钱包配置
PRIVATE_KEY=<your-private-key>

# 后端端口
PORT=3001

# 数据库（可选，用于持久化文件元数据）
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=shopmate
```

## 🔧 集成步骤

### 1. 安装依赖

```bash
cd /Users/yujing/Desktop/2026-web3/0g-shopmate
pnpm install
```

### 2. 验证文件结构

```bash
# 检查已创建的文件
ls apps/backend/src/entities/file.entity.ts
ls apps/backend/src/services/storage.service.ts
ls apps/backend/src/controllers/storage.controller.ts
ls apps/backend/src/modules/storage.module.ts
ls packages/common/src/0g/storage.ts
```

### 3. 启动后端（启用 0G 存储）

```bash
cd apps/backend
pnpm dev
```

### 4. 测试 API

#### 在 Swagger 中测试

访问: http://localhost:3001/api/docs

#### 使用 curl 测试

```bash
# 测试钱包信息
curl http://localhost:3001/api/v1/storage/wallet-info

# 上传文本
curl -X POST http://localhost:3001/api/v1/storage/upload-text \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, 0G Storage!",
    "fileName": "test.txt"
  }'

# 上传 JSON
curl -X POST http://localhost:3001/api/v1/storage/upload-json \
  -H "Content-Type: application/json" \
  -d '{
    "data": {"message": "test"},
    "fileName": "data.json"
  }'
```

## 📊 可用的 API 端点

| 方法 | 路径                                  | 功能             |
| ---- | ------------------------------------- | ---------------- |
| POST | `/api/v1/storage/upload`              | 上传文件（表单） |
| POST | `/api/v1/storage/upload-text`         | 上传文本内容     |
| POST | `/api/v1/storage/upload-json`         | 上传 JSON 数据   |
| POST | `/api/v1/storage/upload-chat-history` | 上传聊天记录     |
| GET  | `/api/v1/storage/verify/{txHash}`     | 验证交易状态     |
| GET  | `/api/v1/storage/wallet-info`         | 获取钱包信息     |
| GET  | `/api/v1/storage/status/{fileId}`     | 获取文件状态     |

## 💡 使用示例

### 示例 1: 在聊天模块中集成

```typescript
// apps/backend/src/modules/chat/chat.controller.ts
import { StorageService } from '../../services/storage.service';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private storageService: StorageService) {}

  @Post('send-and-save')
  async sendAndSave(@Body() body: { message: string; userId: string }) {
    // 处理聊天...

    // 保存到 0G
    await this.storageService.uploadJSON(
      { userId: body.userId, message: body.message, timestamp: new Date() },
      `chat_${body.userId}_${Date.now()}.json`,
      body.userId
    );

    return { success: true };
  }
}
```

### 示例 2: 前端上传文件

```typescript
// apps/frontend/app/components/FileUpload.tsx
import { uploadFile } from '@/lib/storage';

export function FileUpload({ userId }: { userId: string }) {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await fetch('/api/v1/storage/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('Uploaded:', data.data.rootHash);
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
    />
  );
}
```

## ⚠️ 常见问题

### Q: 如何处理大文件？

A: 使用流式上传（需要自定义实现）或分块上传

### Q: 如何加密存储的数据？

A: 在上传前加密，在 FileEntity 中存储加密密钥

### Q: 如何检查交易是否被确认？

```typescript
const status = await storageService.verifyTransaction(txHash);
if (status.status === 'success' && status.confirmations >= 12) {
  // 安全确认
}
```

### Q: 需要数据库吗？

A: 可选。当前实现不需要数据库，但建议使用 TypeORM 持久化 FileEntity

## 📝 后续任务

- [ ] **配置 TypeORM**: 设置 PostgreSQL 连接存储文件元数据
- [ ] **文件加密**: 实现上传前加密，下载时解密
- [ ] **文件下载**: 添加从 0G 网络检索文件的端点
- [ ] **访问控制**: 实现基于用户的文件访问权限
- [ ] **文件过期**: 实现文件过期和自动清理
- [ ] **批量操作**: 添加批量上传、删除、导出
- [ ] **前端整合**: 创建完整的文件管理 UI
- [ ] **测试**: 编写 e2e 和单元测试

## 🚀 快速启动

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 并填入你的配置

# 3. 启动后端
cd apps/backend
pnpm dev

# 4. 访问 Swagger
# http://localhost:3001/api/docs

# 5. 测试上传
curl -X POST http://localhost:3001/api/v1/storage/upload-text \
  -H "Content-Type: application/json" \
  -d '{"content": "test", "fileName": "test.txt"}'
```

---

**需要帮助？** 查看 [0G Storage Integration Guide](./0G_STORAGE_INTEGRATION.md)
