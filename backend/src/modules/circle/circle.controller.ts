import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CircleService } from './circle.service';
import { CreateCircleDto, UpdateCircleDto, JoinCircleDto, CircleMemberUpdateDto } from './dto/circle.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('圈子')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('circle')
export class CircleController {
  constructor(private readonly circleService: CircleService) {}

  @Post()
  @ApiOperation({ summary: '创建圈子' })
  async create(@CurrentUser('userId') userId: number, @Body() dto: CreateCircleDto) {
    return this.circleService.create(userId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: '我加入的圈子' })
  async findMyCircles(@CurrentUser('userId') userId: number) {
    return this.circleService.findMyCircles(userId);
  }

  @Get('search')
  @ApiOperation({ summary: '搜索圈子' })
  async search(
    @CurrentUser('userId') userId: number,
    @Query('keyword') keyword?: string,
    @Query('type') type?: number,
    @Query('isPublic') isPublic?: number,
  ) {
    return this.circleService.search(userId, { keyword, type, isPublic: isPublic ? Number(isPublic) : undefined });
  }

  @Get(':id')
  @ApiOperation({ summary: '圈子详情' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.circleService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新圈子' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCircleDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.circleService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除圈子' })
  async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.circleService.delete(id, userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: '加入圈子' })
  async join(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: JoinCircleDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.circleService.join(id, userId, dto);
  }

  @Get(':id/members')
  @ApiOperation({ summary: '圈子成员列表' })
  async getMembers(@Param('id', ParseIntPipe) id: number) {
    return this.circleService.getMembers(id);
  }

  @Put(':id/members/:userId')
  @ApiOperation({ summary: '管理成员 (设置角色/状态)' })
  async updateMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CircleMemberUpdateDto,
    @CurrentUser('userId') operatorId: number,
  ) {
    return this.circleService.updateMember(id, userId, dto, operatorId);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: '离开圈子' })
  async leave(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.circleService.leave(id, userId);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: '移除成员' })
  async removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser('userId') operatorId: number,
  ) {
    return this.circleService.removeMember(id, userId, operatorId);
  }
}
