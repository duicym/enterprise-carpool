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
import { ReviewService } from './review.service';
import { CreateReviewDto, ReplyReviewDto, UpdateReviewStatusDto } from './dto/review.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('评价')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':bookingId')
  @ApiOperation({ summary: '创建评价' })
  async create(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() dto: CreateReviewDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.reviewService.create(bookingId, userId, dto);
  }

  @Post(':id/reply')
  @ApiOperation({ summary: '回复评价' })
  async reply(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplyReviewDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.reviewService.reply(id, userId, dto.content);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '更新评价状态 (管理员)' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewStatusDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.reviewService.updateStatus(id, dto, userId);
  }

  @Get('my/received')
  @ApiOperation({ summary: '收到的评价' })
  async findMyReceivedReviews(
    @CurrentUser('userId') userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewService.findByUser(userId, false, page, limit);
  }

  @Get('my/given')
  @ApiOperation({ summary: '我给出的评价' })
  async findMyGivenReviews(
    @CurrentUser('userId') userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewService.findByUser(userId, true, page, limit);
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: '用户评价统计' })
  async getUserStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.reviewService.getUserRating(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '评价详情' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findById(id);
  }
}
