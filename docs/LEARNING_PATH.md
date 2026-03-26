# 学习路径与开发日志

每天记录学习的核心概念和技术决策，这是**面试准备的关键**。

---

## Day 1: 架构设计与项目初始化

### 学习目标

- [ ] 理解 Monorepo 的优缺点和适用场景
- [ ] 掌握 Next.js 14 App Router 的最新特性
- [ ] 理解 NestJS 的依赖注入（DI）系统
- [ ] 学习企业级项目的文件夹结构设计

### 关键概念

#### Monorepo vs Polyrepo

```
Monorepo 优点:
- 代码重用（shared types, utils）
- 统一版本管理
- 原子性提交（前后端一起）

Monorepo 缺点:
- 构建耗时
- 权限管理复杂

黑客松选择: Monorepo（加快开发速度）
```

#### Next.js 14 vs Next.js 13

```typescript
// Next.js 14 新特性
// 1. App Router (已成熟稳定)
// 2. Server Components (默认)
// 3. App Directory (约定优于配置)
// 4. API Routes 作为后端中间层

// 目录结构
app/
├── layout.tsx          // RootLayout (全局)
├── page.tsx            // 首页
├── (pages)/            // 路由分组
│   ├── chat/page.tsx
│   └── dashboard/page.tsx
└── api/                // API Routes
    ├── chat/route.ts
    └── inference/route.ts
```

#### NestJS 依赖注入

```typescript
// 为什么需要 DI？
// 1. 解耦: Service 不关心如何创建依赖
// 2. 可测试: 可以注入 Mock 对象
// 3. 灵活: 轻松切换实现

// 例子
@Injectable()
export class ChatService {
  constructor(
    private qwenService: QwenService, // 自动注入
    private configService: ConfigService, // 自动注入
  ) {}
}

// NestJS IoC 容器自动处理实例化和注入
```

### 任务

- [x] 创建 Monorepo 根配置
- [x] 初始化 Next.js 和 NestJS 项目结构
- [x] 编写 ARCHITECTURE.md

### 今日总结

Monorepo + Next.js 14 + NestJS 是企业级全栈项目的黄金组合。关键是理解每一层的职责边界。

---

## Day 2: 后端基础与 LangChain 集成

### 学习目标

- [ ] 掌握 NestJS Module 的设计
- [ ] 理解 LangChain 的 Agent 模式（ReAct）
- [ ] 学习异步流处理和 Server-Sent Events (SSE)
- [ ] 理解如何将 LLM 集成到生产系统

### 关键概念

#### LangChain ReAct Pattern

```
ReAct = Reasoning + Acting

循环过程：
1. Thought: 思考当前步骤（用户看不到）
2. Action: 选择工具执行（比如: search_products）
3. Observation: 观察工具的输出
4. 重复 1-3 直到完成任务

优势：
- 可解释性强（用户可看到思考过程）
- 灵活（可以添加任意 Tool）
- 可验证（每一步都有记录）
```

#### 流式响应 (Streaming)

```typescript
// 为什么需要流式响应？
// AI 生成文本是字符字符地生成的，不是一次性的
// 如果等待完整响应，用户体验差（可能等 10 秒）

// 流式方案: Server-Sent Events (SSE)
@Post('chat')
async chat(@Res() res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');

  const stream = await this.qwenService.streamChat(message);
  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify({text: chunk})}\n\n`);
  }

  res.end();
}

// 前端监听
const eventSource = new EventSource('/api/chat');
eventSource.onmessage = (event) => {
  // 实时更新 UI
};
```

### 任务

- [x] 创建 ChatService 和 QwenService
- [x] 实现 ReAct Agent 编排
- [x] 测试流式响应

### 今日总结

LangChain + Qwen 搭配完美。Stream 流式响应是 AI 应用的必需技能。

---

## Day 3: Web3 集成与 0G Storage

### 学习目标

- [ ] 理解区块链数据存储的必要性
- [ ] 掌握 0G Storage 的核心概念（dataRoot, Merkle Proof）
- [ ] 学习如何将链上和链下数据融合
- [ ] 理解 Web3 钱包集成的安全性

### 关键概念

#### 0G Storage vs 传统数据库

```
传统数据库 (PostgreSQL):
- 中心化: 公司拥有数据
- 快速: 毫秒级查询
- 黑盒: 用户不知道数据如何被处理

0G Storage:
- 去中心化: 用户拥有私钥 = 拥有数据
- 可验证: Merkle Tree 根 (dataRoot) = 数据指纹
- 透明: 任何人可验证数据未被篡改
```

#### Merkle Tree 和 dataRoot

```
数据: "abc"
    ↓
哈希: H("abc") = 0x123
    ↓
Merkle Tree:
       root(0xABC)
      /          \
   H(abc)      H(def)

dataRoot = root 的哈希值

验证过程:
已知 dataRoot，任何人可以验证：
- 这个特定的数据确实在 0G Storage 中
- 数据未被篡改
- 用户私钥 = 所有权证明
```

#### Web3 钱包集成

```typescript
// Wagmi 是 React 的 Web3 库
import { useAccount, useConnect } from 'wagmi';

function WalletConnect() {
  const { address, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <button onClick={() => connect({ connector: connectors[0] })}>
      {address ? `Connected: ${address}` : 'Connect Wallet'}
    </button>
  );
}

// 钱包地址 = 用户身份
// 签名 = 交易授权（不泄露私钥）
```

### 任务

- [x] 创建 0GStorageService
- [x] 实现数据存证逻辑
- [x] 前端钱包集成

### 今日总结

0G Storage 是 Web3 项目的差异化点。理解 Merkle Proof 是面试的加分项。

---

## Day 4: 智能合约开发

### 学习目标

- [ ] 学习 Solidity 基础语法
- [ ] 理解合约中的状态变量、函数、事件
- [ ] 掌握 Hardhat 开发和测试框架
- [ ] 学习合约安全最佳实践（ReentrancyGuard）

### 关键概念

#### Solidity 基础

```solidity
// 状态变量（存储在链上，需付 Gas）
mapping(address => uint256) public balances;

// 函数（可以修改状态或只读）
function transfer(address to, uint256 amount) public {
  balances[msg.sender] -= amount;
  balances[to] += amount;
  emit Transfer(msg.sender, to, amount);  // 事件日志
}

// 事件（链上日志，便于追踪和索引）
event Transfer(address indexed from, address indexed to, uint256 amount);
```

#### Hardhat 测试框架

```typescript
// Hardhat 是智能合约开发的标准工具
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Payment", () => {
  it("Should transfer funds", async () => {
    const [owner, user] = await ethers.getSigners();

    // 部署合约
    const Payment = await ethers.getContractFactory("Payment");
    const payment = await Payment.deploy();

    // 执行交易并验证
    await payment
      .connect(user)
      .sendPayment(owner.address, ethers.parseEther("1.0"), ethers.ZeroHash);

    expect(await payment.balances(owner.address)).to.equal(
      ethers.parseEther("1.0"),
    );
  });
});
```

#### 安全最佳实践

```solidity
// ReentrancyGuard: 防止重入攻击
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Payment is ReentrancyGuard {
  function withdraw(uint256 amount) external nonReentrant {
    // 这个函数最多被调用一次（即使在回调中尝试重入）
  }
}

// Checks-Effects-Interactions (CEI) 模式
function withdraw(uint256 amount) external {
  // Checks: 验证条件
  require(balances[msg.sender] >= amount);

  // Effects: 修改状态
  balances[msg.sender] -= amount;

  // Interactions: 外部调用（最后才做）
  (bool success, ) = payable(msg.sender).call{value: amount}("");
  require(success);
}
```

### 任务

- [x] 编写 Payment.sol 合约
- [x] 编写合约单元测试
- [x] 部署到测试网

### 今日总结

Solidity 安全编程很关键。ReentrancyGuard 和 CEI 模式是面试考点。

---

## Day 5: 前端完整实现

### 学习目标

- [ ] 掌握 Next.js 14 Server Components vs Client Components
- [ ] 学习使用 SWR 进行数据获取和缓存
- [ ] 理解如何在 React 中处理 Web3 钱包状态
- [ ] 学习流式 UI 更新（Suspense + Streaming）

### 关键概念

#### Server Components vs Client Components

```typescript
// Server Component (默认)
// 直接在服务器运行，不发送到浏览器
export default async function ChatPage() {
  const messages = await fetchMessages();
  return <ChatUI messages={messages} />;
}

// Client Component
// 在浏览器中运行，有交互能力
'use client';
export default function ChatInput() {
  const [input, setInput] = useState('');
  return <input onChange={(e) => setInput(e.target.value)} />;
}

// 最佳实践: 让 Server Components 尽可能多
// 因为可以减少 JS 发送给浏览器
```

#### SWR (Stale-While-Revalidate)

```typescript
import useSWR from 'swr';

function ChatUI() {
  // SWR 自动处理缓存、重试、去重
  const { data: messages, error, isLoading } = useSWR(
    '/api/chat/history',
    fetcher,
    {
      revalidateOnFocus: false,  // 用户切回应用时不重新请求
      dedupingInterval: 5000,    // 5秒内相同请求只发一次
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{messages.map(m => <Message {...m} />)}</div>;
}
```

#### 流式 UI (Streaming + Suspense)

```typescript
// 前端显示加载状态，后端流式返回数据
'use client';
import { Suspense } from 'react';

export default function ChatWith Streaming() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatMessages />
    </Suspense>
  );
}

async function ChatMessages() {
  // 服务器流式发送数据
  const stream = await fetch('/api/chat', {
    headers: { Accept: 'text/event-stream' }
  });

  // React 18 streaming 支持
}
```

### 任务

- [x] 创建 /chat /dashboard /monitor /data 页面
- [x] 集成 Wagmi 钱包
- [x] 实现流式消息渲染

### 今日总结

Next.js 14 的 Server Components 改变了 Web 开发的方式。理解何时用 Server vs Client 很关键。

---

## Day 6-7: 测试、部署、学习总结

### 学习目标

- [ ] 学习 E2E 测试（Playwright）
- [ ] 掌握 Docker 容器化
- [ ] 理解 CI/CD 流水线（GitHub Actions）
- [ ] 学习部署到 Vercel 和 Railway

### 关键概念

#### E2E 测试

```typescript
import { test, expect } from "@playwright/test";

test("User can send and receive chat message", async ({ page }) => {
  await page.goto("http://localhost:3000/chat");

  // 输入消息
  await page.fill('input[name="message"]', "Hello");
  await page.click('button:has-text("Send")');

  // 验证响应
  await expect(page.locator("text=Hello")).toBeVisible();
  await expect(page.locator(".ai-message")).toBeTruthy();
});
```

#### Docker 容器化

```dockerfile
# 前端 Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY fronent/package.json .
RUN pnpm install
COPY fronent .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

#### GitHub Actions CI/CD

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Run tests
        run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: pnpm deploy
```

### 任务

- [x] 编写 E2E 测试用例
- [x] 创建 Dockerfile
- [x] 配置 GitHub Actions
- [x] 部署到 Vercel + Railway

### 今日总结

自动化测试和部署是企业级项目的必需。掌握这些技能能显著提升开发效率。

---

## 面试准备要点

### 项目架构相关

1. **为什么选择 Monorepo？**
   - 答: 代码重用、依赖一致、原子性提交、便于黑客松集成

2. **NestJS vs Express 的区别？**
   - 答: DI 系统、模块化、装饰器、企业级开发体验

3. **Server Components 的优势？**
   - 答: 减少 JS Bundle、安全性（隐藏 API keys）、数据获取靠近数据源

### Web3 相关

1. **0G Storage 的可验证性如何实现？**
   - 答: Merkle Tree + dataRoot（根哈希），任何人可验证数据完整性

2. **智能合约中为什么需要 ReentrancyGuard？**
   - 答: 防止重入攻击，在递归调用中重复使用余额

3. **Wagmi 的作用？**
   - 答: 简化 Web3 交互，自动状态管理，React Hooks API

### AI/LangChain 相关

1. **ReAct 模式的优势？**
   - 答: Thought → Action → Observation，可解释性强，灵活问题求解

2. **为什么用流式响应？**
   - 答: AI 文本逐字生成，用 SSE 实时推送，提升 UX

---

**更新日期**: 2026-03-24  
**项目**: 0G-ShopMate

持续更新中...
