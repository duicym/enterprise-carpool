import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, CancelBookingDto, RejectBookingDto } from './dto/booking.dto';
import { BookingStatus } from './entities/booking.entity';
import { JwtGuard } from '../../guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('预约')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post(':tripId')
  @ApiOperation({ summary: '创建预约' })
  async create(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Body() dto: CreateBookingDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.bookingService.create(tripId, userId, dto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: '车主确认预约' })
  async confirm(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.bookingService.confirm(id, userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '乘客取消预约' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelBookingDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.bookingService.cancel(id, userId, dto.reason);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: '车主拒绝预约' })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectBookingDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.bookingService.reject(id, userId, dto.reason);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: '完成行程' })
  async complete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.bookingService.complete(id, userId);
  }

  @Get('my')
  @ApiOperation({ summary: '我的预约列表' })
  async findMyBookings(
    @CurrentUser('userId') userId: number,
    @Query('status') status?: number,
  ) {
    return this.bookingService.findByUser(userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: '预约详情' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findById(id);
  }

  @Get('trip/:tripId')
  @ApiOperation({ summary: '行程的预约列表 (车主视图)' })
  async findByTrip(@Param('tripId', ParseIntPipe) tripId: number) {
    return this.bookingService.findByTrip(tripId);
  }
}
