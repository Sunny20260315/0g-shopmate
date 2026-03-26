/**
 * Web3 钱包认证服务
 *
 * 🔑 核心概念：SIWE (Sign-In with Ethereum) 认证流程
 *
 * 为什么需要 nonce？（防重放攻击）
 *   如果每次签名消息相同，攻击者截获一次签名就能永远冒充你。
 *   nonce 是服务端生成的一次性随机值，签名后立即失效，确保每次签名唯一。
 *
 * 为什么签消息而不签交易？（零 Gas 认证）
 *   签交易要上链、花 Gas、等确认。personal_sign 是纯链下密码学运算，
 *   零 Gas、瞬时完成，同样能证明你拥有私钥。
 *
 * 签名验证如何证明身份？
 *   以太坊签名使用 ECDSA 算法。给定 message + signature，
 *   ethers.verifyMessage() 可以数学恢复出产生该签名的地址。
 *   如果恢复出的地址 === 你声称的地址，身份验证通过。
 *   私钥永远不会离开钱包。
 */
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { randomBytes } from 'crypto';
import { UserService } from '../user/user.service';

interface NonceRecord {
  nonce: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // 内存存储 nonce，key = lowercase address
  // 生产环境应使用 Redis 等分布式存储
  private nonceStore = new Map<string, NonceRecord>();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  /**
   * 生成 nonce（挑战码）
   * 前端调用此接口获取 nonce，然后让用户签名
   */
  generateNonce(address: string): string {
    const normalizedAddress = address.toLowerCase();

    // 清理过期的 nonce（简单的 GC）
    this.cleanExpiredNonces();

    // 生成 32 字节随机 hex 字符串
    const nonce = randomBytes(32).toString('hex');

    // 存储 nonce，5 分钟有效期
    this.nonceStore.set(normalizedAddress, {
      nonce,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    this.logger.log(`Nonce generated for ${normalizedAddress}`);
    return nonce;
  }

  /**
   * 构建待签名的消息
   * 用户在 MetaMask 弹窗中看到的就是这段文字
   */
  buildSignMessage(nonce: string): string {
    return `Sign in to 0G-ShopMate\nNonce: ${nonce}`;
  }

  /**
   * 验证签名并签发 JWT
   *
   * 这是整个认证流程的核心：
   * 1. 检查 nonce 是否存在且未过期
   * 2. 用 ethers.verifyMessage() 从签名恢复地址
   * 3. 比对恢复的地址和声称的地址
   * 4. 创建或查找用户
   * 5. 签发 JWT
   */
  async verifySignature(
    address: string,
    signature: string,
    nonce: string,
  ): Promise<{ accessToken: string; user: { address: string; name?: string } }> {
    const normalizedAddress = address.toLowerCase();

    // 1. 检查 nonce
    const record = this.nonceStore.get(normalizedAddress);
    if (!record) {
      throw new UnauthorizedException('Nonce not found. Please request a new one.');
    }
    if (record.nonce !== nonce) {
      throw new UnauthorizedException('Invalid nonce.');
    }
    if (Date.now() > record.expiresAt) {
      this.nonceStore.delete(normalizedAddress);
      throw new UnauthorizedException('Nonce expired. Please request a new one.');
    }

    // 🔑 先删后验（防 TOCTOU 竞态）
    // 即使后续验签失败，nonce 也已消耗，防止并发请求复用同一 nonce
    this.nonceStore.delete(normalizedAddress);

    // 2. 恢复签名者地址
    const message = this.buildSignMessage(nonce);
    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch {
      throw new UnauthorizedException('Invalid signature format.');
    }

    // 3. 比对地址（忽略大小写，EIP-55 checksum 地址可能大小写不同）
    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      this.logger.warn(
        `Address mismatch: claimed=${normalizedAddress}, recovered=${recoveredAddress.toLowerCase()}`,
      );
      throw new UnauthorizedException('Signature does not match the claimed address.');
    }

    // 4. 查找或创建用户
    const user = await this.userService.findOrCreateByAddress(normalizedAddress);

    // 5. 签发 JWT
    const payload = { sub: normalizedAddress, address: normalizedAddress };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`User authenticated: ${normalizedAddress}`);

    return {
      accessToken,
      user: { address: user.address, name: user.name },
    };
  }

  /**
   * 清理过期的 nonce 记录
   */
  private cleanExpiredNonces(): void {
    const now = Date.now();
    for (const [address, record] of this.nonceStore.entries()) {
      if (now > record.expiresAt) {
        this.nonceStore.delete(address);
      }
    }
  }
}
