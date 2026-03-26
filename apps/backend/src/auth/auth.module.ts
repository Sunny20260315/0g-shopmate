import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

/**
 * @Global() 让本模块导出的 JwtModule 在所有模块中可用
 * 这样 UserController 中的 JwtAuthGuard 能注入 JwtService
 * 否则每个用到 Guard 的模块都要手动 import JwtModule（不优雅）
 *
 * 🔑 为什么用 registerAsync 而不是 register？
 *   register() 在模块导入阶段就执行（此时 .env 还没加载）
 *   registerAsync + ConfigService 会等 ConfigModule 初始化完成后再执行
 */
@Global()
@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        return {
          secret,
          signOptions: { expiresIn: 86400 }, // 24 小时（秒）
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
