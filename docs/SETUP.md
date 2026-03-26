# 快速开始指南

## 前置要求

- Node.js >= 18.x
- pnpm >= 8.x
- PostgreSQL 16（或 Docker）
- Redis（或 Docker）
- Git

## 环境配置

### 1. 克隆项目并安装依赖

```bash
cd 0g-shopmate

# 安装所有子项目的依赖
pnpm install
```

### 2. 配置环境变量

#### 前端 (`fronent/.env.local`)

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Web3 配置
NEXT_PUBLIC_0G_RPC_URL=https://rpc-testnet-v2.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=0g_testnet_v2

# 钱包配置
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_wallet_connect_id
```

#### 后端 (`backend/.env`)

```env
# 应用配置
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug

# 数据库
DATABASE_URL=postgresql://shopmate:shopmate123@localhost:5432/shopmate_dev
REDIS_URL=redis://localhost:6379

# AI API
QWEN_API_KEY=your_api_key_here

# Web3
PRIVATE_KEY=your_wallet_private_key
0G_RPC_URL=https://rpc-testnet-v2.0g.ai
PAYMENT_CONTRACT_ADDRESS=0x...

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

#### 智能合约 (`contracts/.env`)

```env
NETWORK=0g-testnet
PRIVATE_KEY=your_deployer_private_key
0G_RPC_URL=https://rpc-testnet-v2.0g.ai
```

### 3. 启动本地开发环境

#### 方式 A：使用 Docker（推荐）

```bash
# 启动 PostgreSQL 和 Redis
pnpm docker:up

# 初始化数据库
pnpm -C backend db:migrate

# 启动前后端
pnpm dev
```

#### 方式 B：手动启动

```bash
# 终端 1: 启动前端
pnpm dev:frontend
# 访问 http://localhost:3000

# 终端 2: 启动后端
pnpm dev:backend
# API 监听 http://localhost:3001

# 终端 3: 启动本地智能合约节点（可选）
pnpm dev:contracts
```

### 4. 验证安装

前端就绪：

```bash
curl http://localhost:3000
```

后端就绪：

```bash
curl http://localhost:3001/api/health
# 返回: {"status":"ok"}
```

---

## 常见问题

### Q: 安装依赖时出错？

```bash
# 清除缓存重试
pnpm store prune
pnpm install --force
```

### Q: PostgreSQL 连接失败？

```bash
# 检查 Docker 是否运行
docker ps | grep postgres

# 重启 Docker
pnpm docker:down
pnpm docker:up
```

### Q: 如何修改 AI API？

在 `backend/src/modules/chat/services/qwen.service.ts` 中修改：

```typescript
const model = new ChatTongyi({
  alibabaApiKey: process.env.QWEN_API_KEY,
  model: "qwen-turbo", // 改成其他模型
  temperature: 0.7,
});
```

---

## 下一步

- 查看 [API 文档](./API.md) 了解所有端点
- 查看 [架构设计文档](./ARCHITECTURE.md) 理解系统设计
- 查看 [学习路径](./LEARNING_PATH.md) 开始开发
