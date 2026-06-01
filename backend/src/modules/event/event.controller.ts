import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto, JoinEventDto } from '../dto/event.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('团建活动')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post(':circleId')
  @ApiOperation({ summary: '创建团建活动' })
  async create(
    @Param('circleId', ParseIntPipe) circleId: number,
    @Body() dto: CreateEventDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.eventService.create(circleId, userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '活动详情' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findById(id);
  }

  @Get('circle/:circleId')
  @ApiOperation({ summary: '圈子内的活动列表' })
  async findByCircle(@Param('circleId', ParseIntPipe) circleId: number) {
    return this.eventService.findByCircle(circleId);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新活动' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.eventService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除活动' })
  async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.eventService.delete(id, userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: '报名参加活动' })
  async join(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: JoinEventDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.eventService.join(id, userId, dto);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: '退出活动' })
  async leave(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.eventService.leave(id, userId);
  }

  @Post(':id/allocate')
  @ApiOperation({ summary: '智能分配车辆' })
  async allocate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.eventService.allocate(id, userId);
  }

  @Get(':id/allocation')
  @ApiOperation({ summary: '查看分配结果' })
  async getAllocationResult(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getAllocationResult(id);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: '参与者列表' })
  async getParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getParticipants(id);
  }
}
