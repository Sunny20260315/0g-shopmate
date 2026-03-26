# 0G-ShopMate 架构设计文档

**版本**: v1.0  
**日期**: 2026-03-24  
**赛道**: Track 3 - Agentic Economy & Autonomous Applications

---

## 1. 系统架构概览

```
┌──────────────────────────────────────────────────────────────┐
│                      前端层 (Next.js 14)                     │
├──────────────────────────────────────────────────────────────┤
│  UI Pages: /chat /dashboard /monitor /data                   │
│  Services: Auth, Wallet, API Client, 0G Storage Client       │
└──────────────┬───────────────────────────────────────────────┘
               │ HTTP / REST API
┌──────────────▼───────────────────────────────────────────────┐
│                  API 网关层 (Next.js API Routes)             │
├──────────────────────────────────────────────────────────────┤
│  /api/chat, /api/inference/*, /api/blockchain                │
│  (路由转发到 NestJS 后端)                                    │
└──────────────┬───────────────────────────────────────────────┘
               │ 内部调用
┌──────────────▼───────────────────────────────────────────────┐
│              业务逻辑层 (NestJS + TypeScript)                 │
├──────────────────────────────────────────────────────────────┤
│  - ChatService (LangChain + Qwen AI)                          │
│  - InferenceService (意图识别 + 推荐)                        │
│  - ContractService (智能合约交互)                            │
│  - 0GStorageService (数据存证)                               │
│  - UserService (用户管理)                                    │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│            数据持久化层 (PostgreSQL + Redis)                  │
├──────────────────────────────────────────────────────────────┤
│  PostgreSQL: 用户、交易历史、推荐记录                         │
│  Redis: 会话缓存、消息队列                                   │
│  0G Storage: 去中心化用户数据存储                            │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│            区块链层 (Smart Contracts)                         │
├──────────────────────────────────────────────────────────────┤
│  - Payment.sol (支付和分润)                                  │
│  - AgentID.sol (Agent 身份 NFT)                              │
│  - DataMarket.sol (数据交易市场)                             │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. 技术栈选型

| 层级          | 技术选择                 | 版本   | 选型理由                                          |
| ------------- | ------------------------ | ------ | ------------------------------------------------- |
| **前端**      | Next.js 14               | 14.x   | App Router (SSR) + API Routes + Server Components |
| **前端样式**  | Tailwind CSS + shadcn/ui | 最新   | 快速原型 + 企业级 UI                              |
| **前端状态**  | React Hooks + SWR        | 最新   | 简洁的数据获取和缓存                              |
| **Web3 前端** | Wagmi + Web3Modal        | 最新   | React Hooks 式 API，自动状态管理                  |
| **后端**      | NestJS                   | 10.x   | 企业级架构、依赖注入、模块化                      |
| **数据库**    | PostgreSQL               | 16     | 关系型数据、事务支持、JSON 类型                   |
| **缓存**      | Redis                    | 7      | 高速缓存、消息队列                                |
| **ORM**       | TypeORM                  | 0.3.x  | 类型安全、迁移管理                                |
| **AI 编排**   | LangChain                | 0.1.x  | 模型无关、工具集成、Agent 框架                    |
| **LLM**       | 阿里云通义千问           | 最新   | 国内免费额度、API 兼容 OpenAI                     |
| **Web3 SDK**  | ethers.js                | 6.x    | 合约交互、钱包集成                                |
| **0G SDK**    | @0glabs/ts-sdk           | 最新   | 存储客户端                                        |
| **智能合约**  | Solidity                 | 0.8.20 | 安全性好、库完善                                  |
| **合约开发**  | Hardhat                  | 最新   | 开发环境、测试框架                                |

---

## 3. 模块化设计（DDD）

```
backend/src/
├── modules/
│   ├── auth/                    # 认证模块
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dtos/
│   │   ├── guards/
│   │   └── auth.module.ts
│   │
│   ├── chat/                    # 聊天模块
│   │   ├── controllers/
│   │   │   └── chat.controller.ts
│   │   ├── services/
│   │   │   ├── qwen.service.ts
│   │   │   └── chat-0g.service.ts
│   │   ├── dtos/
│   │   │   ├── send-message.dto.ts
│   │   │   └── chat-response.dto.ts
│   │   └── chat.module.ts
│   │
│   ├── inference/               # 推理模块
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dtos/
│   │   └── inference.module.ts
│   │
│   ├── blockchain/              # 区块链模块
│   │   ├── services/
│   │   │   ├── contract.service.ts
│   │   │   └── payment.service.ts
│   │   ├── contracts/
│   │   │   └── abis/
│   │   └── blockchain.module.ts
│   │
│   ├── storage/                 # 存储模块
│   │   ├── services/
│   │   │   └── 0g-storage.service.ts
│   │   └── storage.module.ts
│   │
│   └── user/                    # 用户模块
│       ├── controllers/
│       ├── services/
│       └── user.module.ts
│
├── common/
│   ├── filters/                 # 异常过滤器
│   ├── interceptors/            # 请求响应拦截器
│   ├── guards/                  # 认证卫士
│   └── decorators/              # 自定义装饰器
│
├── config/                      # 配置管理
├── database/                    # 数据库配置
└── app.module.ts               # 根模块
```

---

## 4. 数据流示例：用户发送聊天消息

```
用户在前端输入消息
    ↓
Next.js API Routes (/api/chat)
    ↓
验证请求 (Guard)
    ↓
NestJS ChatController.sendMessage()
    ↓
ChatService.handleMessage()
    ├─ 调用 QwenService.streamChat()
    │   └─ 调用阿里云通义千问 API
    ├─ 提取用户偏好特征
    └─ 调用 Chat0GService.storePreference()
        └─ 上传偏好到 0G Storage
            └─ 返回 dataRoot 证明
    ↓
返回流式结果 (Server-Sent Events)
    ↓
前端接收 + 显示
    ├─ 渲染 AI 思考过程
    ├─ 显示推荐结果
    └─ 展示 0G Storage 证明链接
```

---

## 5. 关键技术决策

### 5.1 为什么使用 Monorepo？

**优点**：

- ✅ 代码重用（shared types, constants, utils）
- ✅ 依赖一致性管理
- ✅ 原子性提交（前后端同时更新）
- ✅ 便于黑客松 demo（一条命令启动全栈）

**缺点**（可接受）：

- 构建耗时（但黑客松时间内可接受）
- 权限管理复杂（个人项目不是问题）

**替代方案**：独立仓库（但会增加 2-3 小时集成时间）

### 5.2 为什么选择 NestJS？

**相比 Express**：

- ✅ 内置依赖注入（便于单元测试）
- ✅ 模块系统（代码组织清晰）
- ✅ 装饰器和拦截器（企业级功能）
- ✅ TypeScript first（类型安全）

**相比 Django**：

- ✅ Node.js 单语言全栈
- ✅ 与前端共享类型定义

### 5.3 为什么用 0G Storage 而不是传统数据库？

**优点**：

- ✅ 数据所有权归用户（私钥 = 所有权）
- ✅ 可验证性（Merkle Proof）
- ✅ 可组合性（dataRoot 可作为链上合约输入）
- ✅ 符合赛道（Track 3 - Agentic Economy）

**缺点**：

- 查询速度慢（但用数据库缓存解决）
- 成本统计复杂（黑客松用免费测试网）

**方案**：

```
用户数据流向：
前端输入 → NestJS 处理 → 存PostgreSQL（快查询）
                      ↓
                  同步到0GStorage（可验证）
                      ↓
                  返回 dataRoot 证明
```

### 5.4 为什么用国内的通义千问而不是 OpenAI？

**优点**：

- ✅ 完全免费（100 万 tokens）
- ✅ 国内访问无延迟
- ✅ LangChain 官方支持
- ✅ 符合黑客松场景

**缺点**：

- 知名度较低（但黑客松评委不介意）
- 中文能力更强（对中文项目是优势）

---

## 6. 安全性考量

### 6.1 前端安全

- ✅ 环境变量隐藏敏感信息（API Key，仅后端）
- ✅ CORS 配置（仅允许白名单域名）
- ✅ 钱包签名验证（防止伪造请求）

### 6.2 后端安全

- ✅ JWT 令牌认证
- ✅ 速率限制（防止滥用）
- ✅ 输入验证 (DTO 类验证)
- ✅ 异常过滤（不泄露内部错误）

### 6.3 智能合约安全

- ✅ ReentrancyGuard（防重入）
- ✅ AccessControl（权限管理）
- ✅ 事件日志（交易可审计）
- ✅ Hardhat 测试覆盖

---

## 7. 部署架构

```
开发环境 (本地)
├─ Next.js (localhost:3000)
├─ NestJS (localhost:3001)
├─ PostgreSQL (localhost:5432)
└─ Redis (localhost:6379)
    ↑
    └─ docker-compose up

演示/测试环境 (0G Testnet)
├─ Vercel (Next.js + API Routes)
├─ Railway/Render (NestJS)
├─ 0G Chain Testnet (智能合约)
└─ 0G Storage Testnet (数据)

生产环境 (未来)
├─ Vercel / Cloudflare Pages
├─ Kubernetes (NestJS)
├─ 0G Mainnet
└─ CDN (静态资产)
```

---

## 8. 性能优化

1. **前端**：
   - 图片懒加载
   - 代码分割 (Code Splitting)
   - API 缓存 (SWR)

2. **后端**：
   - 数据库连接池
   - Redis 缓存热数据
   - LLM 调用结果缓存

3. **区块链**：
   - 批量交易处理
   - Gas 优化
   - 事件索引缓存

---

## 9. 学习路径映射

每个模块对应的学习内容：

```
Module → 技术 → 学习资源
chat → LangChain + ReAct → LangChain 官方文档
blockchain → Solidity + Hardhat → OpenZeppelin Docs
storage → 0G Storage SDK → 0G 官方 SDK 文档
auth → JWT + Guards → NestJS 文档
```

---

## 10. 相关文件

- [API 文档](./API.md) - 所有 API 端点规范
- [快速开始](./SETUP.md) - 本地开发环境搭建
- [学习路径](./LEARNING_PATH.md) - 每日学习记录
- [Web3 集成](./WEB3_INTEGRATION.md) - Web3 特定部分

---

**维护者**: 0G-ShopMate Team  
**最后更新**: 2026-03-24
