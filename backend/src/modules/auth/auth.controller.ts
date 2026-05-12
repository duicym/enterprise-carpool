import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('wechat-login')
  async wechatLogin(@Body() loginDto: LoginDto) {
    const result = await this.authService.wechatLogin(loginDto.code);
    return {
      code: 0,
      message: '登录成功',
      data: {
        token: result.token,
        user: result.user,
        isNew: result.isNew,
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request: any) {
    const user = await this.authService.getUserProfile(request.user.userId);
    return {
      code: 0,
      message: 'success',
      data: user,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    return {
      code: 0,
      message: '登出成功',
      data: null,
    };
  }
}
