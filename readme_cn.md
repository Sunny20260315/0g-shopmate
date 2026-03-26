# 0G-ShopMate: Decentralized Agentic Commerce Hub

Category: Track 3 - Agentic Economy & Autonomous Applications

0G-ShopMate 是一款基于 0G 模块化基础设施构建的自主 AI 购物助手。它不仅是一个对话机器人，更是一个具备独立链上身份 (Agent ID) 和金融支付能力的 “代理商业实体”。通过集成 0G 的存储与计算能力，它实现了从数据确权、智能分析到自动结算的完整 AI 经济闭环。

通过 0G-ShopMate，用户可以跨越 Web2 与 Web3 的边界，享受隐私安全、逻辑透明且完全自动化的智能购物体验。

## 赛道定位 (Track 3 Focus)

本项目深度契合 Track 3: Agentic Economy 的核心愿景：

- 金融轨道 (Financial Rails): 结合 0G Chain 实现微支付与自动化分润。

- AI 商业与社交 (AI Commerce): 打造首个去中心化的 Agent-as-a-Service (AaaS) 购物平台。

- 运营工具: 使用 Agent ID 实现自主管理钱包与资产。

## 系统架构 (System Architecture)

本项目采用模块化架构，实现“数据归用户、能力归 AI、结算归链”。

1. 表现层 (Frontend - Next.js 14)

   AI 交互中心: 沉浸式聊天界面，集成用户偏好实时同步状态。

   0G 证据面板 (Evidence Panel): 实时展示当前 Agent 决策所引用的 0G Storage Root 与链上交易哈希。每一条 AI 建议均附带 0G Storage 的存储哈希，确保推荐逻辑可追溯。

   资产管理: 连接钱包，管理 Agent ID 的授权与资金。

2. 逻辑层 (Agentic Layer - LangChain + 0G SDK)

   智能决策: 聚合跨平台数据（NFT 市场、Web2 电商接口）。

   0G Storage (Long-context Memory): 存储用户的长短期购物偏好。用户拥有其数据的私钥，Agent 仅在授权下读取。

   0G Compute (Verifiable Inference): 运行情感分析与比价模型，确保推荐结果不受中心化广告竞价干扰。

3. 经济结算层 (Settlement Layer - 0G Chain)

- 0G Chain (Settlement): 处理 Micro-payments（微支付）。当用户完成交易，系统自动向数据贡献者和 Agent 运营者分发激励。

- Agent ID: 每个助手拥有独立账户，可自主处理退款、保证金及分红。

## 核心功能页面 (Key Features & Pages)

1.  🤖 AI 自主导购空间 (The Concierge)

    功能: 用户通过自然语言描述需求（如：“帮我找一款 500U 以内、具有 RWA 属性的限量版球鞋”）。

    0G 集成:

        每次对话生成的偏好特征实时加密存入 0G Storage。

        侧边栏显示 "Memory Proof"：展示数据的去中心化存储证明。

2.  📊 跨平台资产监控器 (Omni-Monitor)

    接入应用:

        Web3: 监控 OpenSea/Blur 的地板价或特定合约动态。

        Web2: 抓取 Amazon/Shopify 的比价数据。

    0G 集成: 大规模市场数据镜像存储在 0G Storage，通过 0G DA 确保数据的实时性与可用性，供 AI 模型进行波段分析。

3.  🛡 市场与深度分析 (Data Sovereignty)

    功能: 用户可以查看、导出或一键销毁存储在 0G 上的偏好数据。

    亮点: 实现“数据变现”——用户可选择将加密的购物数据授权给品牌方，通过 0G Chain 自动获取 Token 奖励。

4.  💸 自动化结算流水 (Autonomous Settlement)

    功能: 当 Agent 发现符合预设条件的商品时，自动发起交易请求。

    0G 集成: 使用 Agent ID 签署合约，在 0G Chain 上完成“支付-分红-存证”的一键式操作。

## 技术实现细节 (Technical Stack)

组件,技术方案,作用
Frontend,Next.js + Tailwind + Shadcn,构建极简、高响应的 Web4 交互体验
Storage,0G Storage SDK,存储 AI Memory、商品元数据及用户隐私偏好
Identity,0G Agent ID,AI 助手的独立链上身份与权限管理
Logic,LangChain.js,编排 AI 代理的思考、行动与观测 (ReAct 模式)
Blockchain,0G Chain (Solidity),处理支付逻辑、返佣合约及声誉上链

## 本地快速启动 (Quick Start)

1. 配置环境

复制 .env.example 并填写你的 0G 节点信息与 AI 模型 API：
Bash

NEXT_PUBLIC_0G_STORAGE_NODE="https://rpc-storage-testnet.0g.ai"
NEXT_PUBLIC_0G_CHAIN_ID="0g_chain_16600-2"
PRIVATE_KEY="your_wallet_private_key"

2. 运行项目
   Bash

npm install
npm run dev

3. 核心代码片段：存证用户偏好

```JavaScript
import { ZgClient } from "@0glabs/0g-storage-sdk";

// 将 AI 提取的用户特征存入 0G Storage
const syncMemoryTo0G = async (preferenceJson) => {
  const client = new ZgClient(NODE_RPC);
  const { txHash, dataRoot } = await client.upload(JSON.stringify(preferenceJson));
  console.log(`Memory synced to 0G. Root: ${dataRoot}`);
};
```

## 结语

0G-ShopMate 致力于消除 AI 时代的“算法黑盒”。我们相信，真正的智能购物不应基于平台的竞价排名，而应基于存储在去中心化网络上、由用户完全掌控的真实数据。
