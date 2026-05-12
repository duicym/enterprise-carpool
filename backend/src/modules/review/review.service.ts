import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Order } from '../order/order.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(userId: number, dto: CreateReviewDto): Promise<Review> {
    const existing = await this.reviewRepository.findOne({
      where: { order_id: dto.order_id },
    });

    if (existing) {
      throw new HttpException(
        { code: 7001, message: '该订单已评价' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const review = this.reviewRepository.create({
      order_id: dto.order_id,
      reviewer: { id: userId },
      reviewee: { id: dto.reviewee_id },
      rating: dto.rating,
      content: dto.content,
      is_anonymous: dto.is_anonymous || 0,
      status: 1,
    });

    return await this.reviewRepository.save(review);
  }

  async getList(userId: number, page: number = 1, pageSize: number = 20): Promise<any> {
    const [items, total] = await this.reviewRepository.findAndCount({
      where: [{ reviewer: { id: userId } }, { reviewee: { id: userId } }],
      relations: ['reviewer', 'reviewee'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async getUserStats(userId: number): Promise<any> {
    const reviews = await this.reviewRepository.find({
      where: { reviewee: { id: userId }, status: 1 },
    });

    const total = reviews.length;
    const average = total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    return {
      total,
      average: Number(average.toFixed(2)),
      distribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      },
    };
  }
}
