// Web3 相关类型
export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface PaymentData {
  recipient: string;
  amount: string;
  dataRoot: string;
}

export interface AgentIDMetadata {
  agentAddress: string;
  name: string;
  description: string;
  createdAt: Date;
  totalTransactions: number;
}
