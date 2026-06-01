import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { MarkAsReadDto, ListNotificationsDto } from './dto/notification.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('消息通知')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: '我的消息列表' })
  async findMyNotifications(
    @CurrentUser('userId') userId: number,
    @Query() filters?: ListNotificationsDto,
  ) {
    return this.notificationService.findByUser(userId, filters);
  }

  @Get('count')
  @ApiOperation({ summary: '消息数量统计' })
  async getCount(@CurrentUser('userId') userId: number) {
    return this.notificationService.getCount(userId);
  }

  @Post('mark-read')
  @ApiOperation({ summary: '标记为已读' })
  async markAsRead(
    @Body() dto: MarkAsReadDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.notificationService.markAsRead(dto.ids, userId);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: '全部标记为已读' })
  async markAllAsRead(@CurrentUser('userId') userId: number) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除通知' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.notificationService.delete(id, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '通知详情' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findById(id);
  }
}
