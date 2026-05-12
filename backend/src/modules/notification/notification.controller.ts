import { Controller, Get, Put, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('list')
  async getList(@Req() request: any, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    const result = await this.notificationService.getList(request.user.userId, page, pageSize);
    return {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  @Put(':id/read')
  async markAsRead(@Req() request: any, @Param('id') id: number) {
    await this.notificationService.markAsRead(request.user.userId, id);
    return {
      code: 0,
      message: 'success',
      data: null,
    };
  }

  @Put('read-all')
  async markAllAsRead(@Req() request: any) {
    await this.notificationService.markAllAsRead(request.user.userId);
    return {
      code: 0,
      message: 'success',
      data: null,
    };
  }
}
