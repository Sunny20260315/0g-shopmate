export * from './chat';
export * from './user';
export * from './blockchain';
export * from './auth';

// 用户购物偏好类型
export interface ShopPreference {
  budget: number;
  category: string;
  attributes: string[];
  platform: string[];
  userId: string;
}

// 0G 存证返回类型
export interface OGStorageProof {
  txHash: string;
  dataRoot: string;
}

// 合约交互类型
export interface SettlementTx {
  agentId: string;
  amount: string;
  txHash: string;
}
