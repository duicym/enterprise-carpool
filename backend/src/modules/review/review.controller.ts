import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  async create(@Req() request: any, @Body() createReviewDto: CreateReviewDto) {
    const review = await this.reviewService.create(request.user.userId, createReviewDto);
    return {
      code: 0,
      message: '评价成功',
      data: review,
    };
  }

  @Get('list')
  async getList(@Query('userId') userId: number, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    const result = await this.reviewService.getList(userId, page, pageSize);
    return {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  @Get('user/:id')
  async getUserStats(@Param('id') id: number) {
    const stats = await this.reviewService.getUserStats(id);
    return {
      code: 0,
      message: 'success',
      data: stats,
    };
  }
}
