import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() request: any) {
    const user = await this.userService.getProfile(request.user.userId);
    return {
      code: 0,
      message: 'success',
      data: user,
    };
  }

  @Put('profile')
  async updateProfile(@Req() request: any, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateProfile(request.user.userId, updateUserDto);
    return {
      code: 0,
      message: '更新成功',
      data: user,
    };
  }

  @Get('companies')
  async getUserCompanies(@Req() request: any) {
    const companies = await this.userService.getUserCompanies(request.user.userId);
    return {
      code: 0,
      message: 'success',
      data: companies,
    };
  }
}
