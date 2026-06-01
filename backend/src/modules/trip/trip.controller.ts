
import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TripService } from './trip.service';
import { CreateTripDto, UpdateTripDto, SearchTripsDto } from './dto/trip.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('行程')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post(':circleId')
  @ApiOperation({ summary: '发布行程' })
  async create(
    @Param('circleId', ParseIntPipe) circleId: number,
    @Body() dto: CreateTripDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tripService.create(circleId, userId, dto);
  }

  @Get('circle/:circleId')
  @ApiOperation({ summary: '圈子内的行程列表' })
  async findByCircle(
    @Param('circleId', ParseIntPipe) circleId: number,
    @CurrentUser('userId') userId: number,
    @Query() filters?: SearchTripsDto,
  ) {
    return this.tripService.findByCircle(circleId, userId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: '行程详情' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.tripService.findById(id);
  }

  @Get('my/driving')
  @ApiOperation({ summary: '我发布的行程' })
  async findByDriver(@CurrentUser('userId') userId: number) {
    return this.tripService.findByDriver(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新行程' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTripDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tripService.update(id, userId, dto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '取消行程' })
  async cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.tripService.cancel(id, userId);
  }
}
