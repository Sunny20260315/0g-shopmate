/**
 * JWT 认证守卫
 *
 * 🔑 核心概念：NestJS Guard（守卫）
 * Guard 是 NestJS 的请求拦截器，在 Controller 处理请求之前执行。
 * 用 @UseGuards(JwtAuthGuard) 装饰 Controller 方法，即可保护该接口。
 *
 * 工作流程：
 * 1. 从请求头提取 Authorization: Bearer <token>
 * 2. 用 JwtService 验证 token 签名和有效期
 * 3. 将解码后的用户信息挂载到 request.user
 * 4. 验证失败则返回 401 Unauthorized
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    try {
      // verify() 会检查签名 + 过期时间，失败则抛异常
      request.user = this.jwtService.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
