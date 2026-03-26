/**
 * 认证控制器
 *
 * 提供两个端点完成 Web3 钱包登录：
 *
 * POST /auth/nonce   → 获取随机挑战码
 * POST /auth/verify  → 提交签名，获取 JWT
 *
 * 🔑 为什么是两步而不是一步？
 *   分离 nonce 生成和签名验证，确保每次签名对应唯一挑战，防止重放攻击。
 *   这和传统 OAuth 的 "获取 code → 兑换 token" 思路类似。
 */
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { NonceDto } from './dto/nonce.dto';
import { VerifyDto } from './dto/verify.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  @ApiOperation({ summary: 'Request a nonce for wallet signature' })
  @ApiResponse({ status: 201, description: 'Nonce generated successfully' })
  getNonce(@Body() dto: NonceDto) {
    const nonce = this.authService.generateNonce(dto.address);
    return { nonce };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify wallet signature and get JWT token' })
  @ApiResponse({ status: 201, description: 'Authentication successful, JWT returned' })
  @ApiResponse({ status: 401, description: 'Signature verification failed' })
  async verify(@Body() dto: VerifyDto) {
    return this.authService.verifySignature(dto.address, dto.signature, dto.nonce);
  }
}
