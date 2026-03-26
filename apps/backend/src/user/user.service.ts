/**
 * 用户服务
 *
 * 🔑 Web3 用户管理的核心特点：
 *   - 没有"注册"流程：用户首次签名登录时自动创建
 *   - 没有密码：身份由钱包私钥的签名证明
 *   - 地址即身份：address 是唯一标识符
 *
 * 当前使用内存 Map 存储（开发用），生产环境替换为数据库。
 */
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private users = new Map<string, UserEntity>();

  /**
   * 按地址查找用户
   */
  findByAddress(address: string): UserEntity | undefined {
    return this.users.get(address.toLowerCase());
  }

  /**
   * 查找或创建用户（Web3 的"注册"方式）
   * 用户第一次用钱包签名登录时，自动创建账户
   */
  async findOrCreateByAddress(address: string): Promise<UserEntity> {
    const normalized = address.toLowerCase();
    const existing = this.users.get(normalized);
    if (existing) {
      return existing;
    }

    const user: UserEntity = {
      address: normalized,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(normalized, user);
    this.logger.log(`New user created: ${normalized}`);
    return user;
  }

  /**
   * 更新用户资料
   */
  updateProfile(
    address: string,
    updates: Partial<Pick<UserEntity, 'name' | 'avatar'>>,
  ): UserEntity | undefined {
    const normalized = address.toLowerCase();
    const user = this.users.get(normalized);
    if (!user) return undefined;

    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(normalized, updated);
    return updated;
  }

  /**
   * 获取所有用户（管理用）
   */
  findAll(): UserEntity[] {
    return Array.from(this.users.values());
  }
}
