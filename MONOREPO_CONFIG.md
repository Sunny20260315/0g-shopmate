# 📋 标准 Monorepo 配置验证清单

## 已完成的配置文件

### ✅ 根层级配置 (Root Level)

- **`tsconfig.json`** - 中央 TypeScript 配置，所有包继承此配置
  - 严格模式启用 (strict: true)
  - 路径别名配置: `@shopmate/*` → `packages/*/src`
  - 配置了 ES2020 目标和 DOM/DOM.Iterable 库

- **`pnpm-workspace.yaml`** - Monorepo 工作区配置
  - packages 目录: `packages/*` (共享代码)
  - apps 目录: `apps/*` (应用程序)

- **`turbo.json`** - 任务编排和缓存配置
  - 任务: build, lint, test, type-check, dev
  - 缓存策略: 输出缓存 (outputs array)
  - 任务依赖: build 依赖 type-check
  - 环境变量配置: TURBO\_\*, NODE_ENV 等

- **`package.json`** (根) - Workspace 脚本定义
  - Turbo 运行命令: `turbo run build`
  - 工作区配置和 pnpm 功能

- **`.prettierrc`** - 代码格式化规则
  - 2 空格缩进, 100 字符宽度
  - 使用单引号, 末尾分号

- **`.eslintignore`** - ESLint 忽略文件列表
  - node_modules, dist, coverage, .next 等

- **`.gitignore`** - Git 忽略配置，已更新为 Monorepo 标准

---

## 🎯 Packages (共享库)

### ✅ packages/types

**目的**: 类型定义的单一来源 (Single Source of Truth)

```
package.json         (exports: main, types)
tsconfig.json        (继承自根 tsconfig)
src/
  ├── chat.ts        (Message, ChatResponse, UserPreference, RecommendedProduct)
  ├── blockchain.ts  (BlockchainTransaction, PaymentData, AgentIDMetadata)
  ├── user.ts        (User, UserProfile)
  └── index.ts       (barrel export)
```

**使用方式**:

```typescript
// frontend 和 backend 中导入
import { Message, ChatResponse } from '@shopmate/types';
```

---

### ✅ packages/common

**目的**: 共享工具函数、常量、日志

```
package.json         (exports: logger, constants, utils)
tsconfig.json        (继承自根 tsconfig)
src/
  ├── constants.ts   (API_ENDPOINTS, WEB3_CONFIG, ERROR_CODES)
  ├── logger.ts      (Logger 类实现)
  ├── utils.ts       (formatAddress, isValidEthAddress, 等 helper)
  └── index.ts       (barrel export)
```

**使用方式**:

```typescript
// 在任何应用中导入
import { Logger, API_ENDPOINTS, formatAddress } from '@shopmate/common';
```

---

### ✅ packages/contracts

**目的**: Solidity 智能合约打包和编译

```
package.json         (Hardhat, TypeChain, OpenZeppelin 依赖)
tsconfig.json        (继承自根 tsconfig)
contracts/           (Solidity .sol 文件目录)
```

---

## 🚀 Apps (应用程序)

### ✅ apps/backend

**框架**: NestJS 10.x

**配置文件**:

```
package.json         (NestJS, LangChain, Ethers 依赖 + @shopmate/* 工作区依赖)
tsconfig.json        (NestJS 特定配置, 模块化, outDir: dist)
.eslintrc.json       (ESLint 配置)
.env.example         (环境变量模板)
src/                 (源代码目录)
```

**环境变量** (.env.example):

- 数据库: DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME
- Redis: REDIS_URL
- JWT: JWT_SECRET, JWT_EXPIRATION
- Qwen API: QWEN_API_KEY, QWEN_MODEL
- Web3: 0G_RPC_URL, 0G_CHAIN_ID, PRIVATE_KEY
- 存储: 0G_STORAGE_API, 0G_STORAGE_PUBLIC_KEY

---

### ✅ apps/frontend

**框架**: Next.js 14 (App Router)

**配置文件**:

```
package.json         (Next.js, React 18, Wagmi, Tailwind 依赖 + @shopmate/* 工作区依赖)
tsconfig.json        (Next.js 特定配置)
tsconfig.node.json   (Build 工具 TypeScript 配置)
.eslintrc.json       (ESLint 配置)
next.config.mjs      (Next.js 配置, 环境变量)
tailwind.config.ts   (Tailwind CSS 配置)
postcss.config.mjs   (PostCSS 配置)
.env.example         (环境变量模板)
src/                 (源代码目录)
```

**环境变量** (.env.example):

- API 配置: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_API_TIMEOUT
- Web3: NEXT_PUBLIC_0G_RPC_URL, NEXT_PUBLIC_0G_CHAIN_ID, NEXT_PUBLIC_0G_EXPLORER
- WalletConnect: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
- 功能标志: NEXT_PUBLIC_ENABLE_CHAT, NEXT_PUBLIC_ENABLE_PAYMENTS 等

---

## ✨ 关键特性

### 1. **工作区依赖** (Workspace Protocol)

```json
// apps/backend/package.json
"dependencies": {
  "@shopmate/types": "workspace:*",
  "@shopmate/common": "workspace:*"
}
```

### 2. **任务编排** (Turbo)

```bash
# 智能缓存 - 仅重建修改部分
pnpm turbo run build

# 并行运行开发服务器
pnpm turbo run dev --parallel

# 格式化所有代码
pnpm turbo run format
```

### 3. **路径别名** (TypeScript Paths)

```typescript
// 在任何地方使用简洁导入
import { Message } from '@shopmate/types';
import { Logger } from '@shopmate/common';
```

---

## 🔧 下一步操作

### 立即执行 (Day 1 / 配置阶段)

#### 1️⃣ 验证配置完整性

```bash
cd /Users/yujing/Desktop/2026-web3/0g-shopmate

# 检查 pnpm-workspace.yaml 是否正确
cat pnpm-workspace.yaml

# 检查根 package.json 是否有 Turbo 脚本
cat package.json | grep -A 10 '"scripts"'
```

#### 2️⃣ 复制环境变量文件

```bash
# 为 backend 创建本地 .env
cp apps/backend/.env.example apps/backend/.env

# 为 frontend 创建本地 .env.local
cp apps/frontend/.env.example apps/frontend/.env.local

# 编辑 .env 并填入实际的 API 密钥等
nano apps/backend/.env
nano apps/frontend/.env.local
```

#### 3️⃣ 安装依赖

```bash
# 使用 pnpm 安装所有工作区依赖
pnpm install

# 这会安装：
# - 根层级依赖 (prettier, eslint)
# - packages/types 和 packages/common 的依赖
# - apps/backend 和 apps/frontend 的依赖
# - 自动链接工作区依赖 (@shopmate/types, @shopmate/common)
```

#### 4️⃣ 验证 TypeScript 配置

```bash
# 检查所有包的 TypeScript 编译
pnpm turbo run type-check

# 预期输出: ✓ 所有包编译成功
```

#### 5️⃣ 验证 Turbo 配置

```bash
# 列出所有任务
pnpm turbo run --dry build

# 检查缓存配置
cat turbo.json | grep -A 20 '"tasks"' | head -30
```

---

### 第二步 (Day 2 / 开发阶段)

#### 🔨 启动开发环境

```bash
# 并行启动所有开发服务器
# frontend: localhost:3000
# backend: localhost:3001
pnpm turbo run dev --parallel
```

#### 📝 实现功能代码

- 使用 types 包中定义的 Message, ChatResponse 等类型
- 在 backend 中实现 Chat API
- 在 frontend 中创建页面并导入 @shopmate/types

---

## 📊 项目结构总览

```
0g-shopmate/                    # 根目录
├── packages/                   # 共享库
│   ├── types/                 # 类型定义 (Message, User, Blockchain)
│   ├── common/                # 工具函数 (Logger, Utils, Constants)
│   └── contracts/             # 智能合约
├── apps/                      # 应用程序
│   ├── backend/               # NestJS API 服务器
│   └── frontend/              # Next.js Web 应用
├── docs/                      # 文档
├── pnpm-workspace.yaml        # 工作区配置
├── turbo.json                 # 任务编排配置
├── tsconfig.json              # 根级 TypeScript 配置
├── package.json               # 根级脚本
├── .prettierrc                # 代码格式化
└── .gitignore                 # Git 忽略规则
```

---

## ✅ 验证检查表

- [ ] `pnpm install` 执行成功无错误
- [ ] `pnpm turbo run type-check` 通过
- [ ] `pnpm turbo run lint` 无 ESLint 错误
- [ ] `packages/types` 导出正确
- [ ] `packages/common` 导出正确
- [ ] `apps/backend/package.json` 包含 `@shopmate/*` 依赖
- [ ] `apps/frontend/package.json` 包含 `@shopmate/*` 依赖
- [ ] TypeScript 路径别名可以解析: `import from '@shopmate/types'`
- [ ] Turbo 缓存配置有效

---

## 🎯 架构优势

| 特性             | 好处                                    |
| ---------------- | --------------------------------------- |
| **单一类型来源** | frontend 和 backend 永远同步的类型      |
| **代码复用**     | utilities, constants, logger 避免重复   |
| **智能缓存**     | Turbo 仅重建改动部分，构建速度 100 倍快 |
| **并行开发**     | 多个开发者可并行工作不相互阻滞          |
| **类型安全**     | 严格 TypeScript 配置捕获编译时错误      |
| **可扩展**       | 轻松添加更多 packages 或 apps           |

---

**配置完成！你的项目现在是企业级 Monorepo 结构。** 🚀
