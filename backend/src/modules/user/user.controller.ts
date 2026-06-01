import { Controller, Get, Put, Body, UseGuards, Req, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReviewService } from '../review/review.service';

@ApiTags('用户')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: '获取当前用户信息' })
  async getProfile(@Req() request: any) {
    const user = await this.userService.getProfile(request.user.userId);
    const rating = await this.reviewService.getUserRating(request.user.userId);
    return {
      ...user,
      rating,
    };
  }

  @Put('profile')
  @ApiOperation({ summary: '更新用户信息' })
  async updateProfile(@Req() request: any, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateProfile(request.user.userId, updateUserDto);
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户信息' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getProfile(id);
    const rating = await this.reviewService.getUserRating(id);
    return {
      ...user,
      rating,
    };
  }

  @Get(':id/rating')
  @ApiOperation({ summary: '用户评价统计' })
  async getUserRating(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getUserRating(id);
  }
}
