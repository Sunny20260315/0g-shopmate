// 用户相关类型
export interface User {
  id: string;
  address: string; // Web3 钱包地址
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  bio?: string;
  preferences: Record<string, any>;
  dataStorageRoot?: string; // 0G Storage root
}
