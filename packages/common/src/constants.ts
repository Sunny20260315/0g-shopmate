// API 常量
export const API_ENDPOINTS = {
  CHAT: "/api/chat",
  INFERENCE: "/api/inference",
  BLOCKCHAIN: "/api/blockchain",
  USER: "/api/user",
} as const;

// Web3 常量
export const WEB3_CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_0G_RPC_URL || "https://rpc-testnet-v2.0g.ai",
  CHAIN_ID: process.env.NEXT_PUBLIC_0G_CHAIN_ID || "0g_testnet_v2",
} as const;

// 错误代码
export const ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  AI_ERROR: "AI_ERROR",
} as const;

// 消息类型
export const MESSAGE_TYPES = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;
