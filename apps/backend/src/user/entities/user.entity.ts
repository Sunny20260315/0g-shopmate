/**
 * Web3 用户实体
 *
 * 🔑 核心区别：传统 Web2 用主键 id + 用户名/邮箱标识用户，
 *    Web3 以钱包地址 (address) 作为唯一标识。
 *    地址由公钥推导，公钥由私钥推导 —— 谁掌握私钥，谁就是这个地址的主人。
 */
export class UserEntity {
  address: string;   // 主标识，始终小写存储
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
