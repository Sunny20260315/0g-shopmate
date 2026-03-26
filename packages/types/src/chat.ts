// 聊天相关类型
export interface Message {
  id: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
  dataRoot?: string; // 0G Storage 证明
}

export interface ChatResponse {
  message: Message;
  proof?: {
    dataRoot: string;
    txHash: string;
  };
}

export interface SendMessageDTO {
  userId: string;
  message: string;
}

// 用户偏好
export interface UserPreference {
  userId: string;
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  attributes: Record<string, any>;
  marketTypes: ('web2' | 'web3')[];
}

// 推荐结果
export interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  market: 'web2' | 'web3';
  confidence: number;
  reason: string;
  proof?: string; // dataRoot
}
