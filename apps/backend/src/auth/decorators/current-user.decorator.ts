/**
 * @CurrentUser() 参数装饰器
 *
 * 从 request.user 中提取当前登录用户信息（由 JwtAuthGuard 注入）。
 * 用法：getProfile(@CurrentUser() user: JwtPayload)
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
