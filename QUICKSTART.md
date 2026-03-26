# 🚀 快速开始指南

## 5 分钟内启动整个项目

### 前提条件

- ✅ Node.js 18.17 或更高版本
- ✅ pnpm 8.15 或更高版本 (`npm install -g pnpm`)

---

## 第 1 步：安装依赖 (1 分钟)

```bash
# 进入项目目录
cd /Users/yujing/Desktop/2026-web3/0g-shopmate

# 安装所有工作区依赖
pnpm install
```

**预期输出**:

```
✓ Resolved 1200+ packages in 15s
✓ Installed dependencies
```

---

## 第 2 步：配置环境变量 (1 分钟)

### Backend 环境变量

```bash
# 复制示例文件
cp apps/backend/.env.example apps/backend/.env

# 编辑 .env 文件（重要的密钥已有默认值）
# 你需要更新:
# - QWEN_API_KEY: 从阿里云获取
# - PRIVATE_KEY: 你的以太坊私钥（测试网用）
nano apps/backend/.env
```

### Frontend 环境变量

```bash
# 复制示例文件
cp apps/frontend/.env.example apps/frontend/.env.local

# 现有的默认值已可用，可选择更新:
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: 从 WalletConnect 获取
nano apps/frontend/.env.local
```

---

## 第 3 步：验证配置 (1 分钟)

```bash
# 检查 TypeScript 编译
pnpm turbo run type-check

# 预期结果: ✓ 所有包通过类型检查
```

---

## 第 4 步：启动开发环境 (2 分钟)

### 方式 A: 启动两个服务器 (推荐)

```bash
# 在终端 1 中启动 backend 和 frontend
pnpm turbo run dev --parallel

# Frontend 将在 http://localhost:3000
# Backend 将在 http://localhost:3001
```

### 方式 B: 分别启动 (调试用)

```bash
# 终端 1: 启动 Backend
cd apps/backend
pnpm dev
# 或: pnpm start:debug

# 终端 2: 启动 Frontend
cd apps/frontend
pnpm dev
```

---

## ✅ 验证成功

### 检查 Frontend

打开浏览器:

- http://localhost:3000

预期看到: Next.js 默认页面

### 检查 Backend

```bash
# 在新终端中测试 API
curl http://localhost:3001/api/health

# 预期响应: {"status":"ok","timestamp":"..."}
```

---

## 💻 常用命令

### 开发

```bash
# 启动所有服务
pnpm turbo run dev --parallel

# 只启动 backend
cd apps/backend && pnpm dev

# 只启动 frontend
cd apps/frontend && pnpm dev
```

### 构建

```bash
# 构建所有项目
pnpm turbo run build

# 只构建 backend
cd apps/backend && pnpm build

# 只构建 frontend
cd apps/frontend && pnpm build
```

### 代码质量

```bash
# 检查所有 TypeScript 编译
pnpm turbo run type-check

# 格式化所有代码
pnpm turbo run format

# Lint 所有代码
pnpm turbo run lint

# 运行测试
pnpm turbo run test
```

### 数据库（Backend）

```bash
cd apps/backend

# 创建数据库迁移
pnpm run db:migrate:create -- --name CreateUsersTable

# 运行所有数据库迁移
pnpm run db:migrate
```

---

## 🔗 工作区结构

```
项目
├── packages/types/        → 类型定义（Message, User 等）
├── packages/common/       → 共享工具（Logger, Utils）
├── apps/backend/          → NestJS API 服务
└── apps/frontend/         → Next.js Web 应用
```

### 在代码中使用共享库

```typescript
// 在 backend 或 frontend 中都可以这样导入
import { Message, ChatResponse } from '@shopmate/types';
import { Logger, API_ENDPOINTS } from '@shopmate/common';
```

---

## 🐛 故障排查

### 问题: `pnpm install` 失败

**解决方案**:

```bash
# 清除缓存
pnpm store prune

# 重新安装
pnpm install

# 如果仍然失败，升级 pnpm
npm install -g pnpm@latest
```

---

### 问题: Port 3000 或 3001 已被占用

**解决方案**:

```bash
# 找到占用该端口的进程
lsof -i :3000          # 查看 3000 端口
lsof -i :3001          # 查看 3001 端口

# 杀死进程
kill -9 <PID>

# 或在 .env 中改变端口
# apps/backend/.env: PORT=3002
# apps/frontend: pnpm dev -p 3002
```

---

### 问题: TypeScript 错误 "Cannot find module '@shopmate/types'"

**解决方案**:

```bash
# 确保依赖已正确链接
pnpm install

# 重新启动 TypeScript 服务器 (VSCode 中)
# Ctrl+Shift+P → TypeScript: Restart TS Server

# 清除缓存并重新构建
pnpm turbo run clean
pnpm turbo run build
```

---

### 问题: 数据库连接失败

**解决方案**:

```bash
# 1. 检查 Docker 是否运行 (如果使用 docker-compose)
docker ps

# 2. 启动数据库
docker-compose up -d

# 3. 检查 .env 中的数据库凭证
cat apps/backend/.env | grep DATABASE

# 4. 测试连接
psql -h localhost -U shopmate -d shopmate_dev -c "SELECT 1"
```

---

## 📚 完整文档位置

- **架构设计**: 查看 [ARCHITECTURE.md](./ARCHITECTURE.md)
- **项目设置**: 查看 [SETUP.md](./SETUP.md)
- **学习路径**: 查看 [LEARNING_PATH.md](./LEARNING_PATH.md)
- **Monorepo 配置**: 查看 [MONOREPO_CONFIG.md](./MONOREPO_CONFIG.md)

---

## 🎯 下一步

1. **Day 1-2**: 完成 Backend Chat API
   - 实现 `POST /api/chat/send`
   - 集成 Qwen LLM 和 LangChain

2. **Day 3-4**: 构建 Frontend UI
   - 创建聊天页面 (`/chat`)
   - 钱包集成 (Wagmi)
   - 实时流式消息

3. **Day 5**: Smart Contracts
   - 部署支付合约
   - 集成 0G Storage

4. **Day 6-7**: 测试和部署
   - E2E 测试
   - 部署到 Vercel/Railway

---

**准备好了？运行 `pnpm turbo run dev --parallel` 开始编码！** 🚀
