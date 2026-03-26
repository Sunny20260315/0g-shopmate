import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前登录用户的资料
   * 需要 JWT 认证（Authorization: Bearer <token>）
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile (requires auth)' })
  getProfile(@CurrentUser() user: { address: string }) {
    return this.userService.findByAddress(user.address);
  }

  /**
   * 更新当前用户资料
   */
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile (requires auth)' })
  updateProfile(
    @CurrentUser() user: { address: string },
    @Body() body: { name?: string; avatar?: string },
  ) {
    return this.userService.updateProfile(user.address, body);
  }
}
