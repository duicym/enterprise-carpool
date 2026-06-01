import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Review, ReviewStatus } from '../entities/review.entity';
import { Booking, BookingStatus } from '../../booking/entities/booking.entity';
import { CreateReviewDto, UpdateReviewStatusDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(
    bookingId: number,
    userId: number,
    dto: CreateReviewDto,
  ): Promise<Review> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['driver', 'passenger'],
    });

    if (!booking) {
      throw new NotFoundException('预约不存在');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('只有已完成的行程才能评价');
    }

    if (booking.passengerId !== userId && booking.driverId !== userId) {
      throw new ForbiddenException('无权限评价该行程');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { bookingId },
    });

    if (existingReview) {
      throw new BadRequestException('已评价过该行程');
    }

    const revieweeId =
      userId === booking.passengerId ? booking.driverId : booking.passengerId;

    const review = this.reviewRepository.create({
      bookingId,
      reviewerId: userId,
      revieweeId,
      rating: dto.rating,
      content: dto.content,
      isAnonymous: dto.isAnonymous || 0,
      status: ReviewStatus.NORMAL,
    });

    await this.reviewRepository.save(review);
    await this.updateUserRating(revieweeId);

    return review;
  }

  async reply(reviewId: number, userId: number, content: string): Promise<Review> {
    const review = await this.findById(reviewId);

    if (review.revieweeId !== userId) {
      throw new ForbiddenException('无权限回复该评价');
    }

    if (review.replyContent) {
      throw new BadRequestException('已回复过');
    }

    review.replyContent = content;
    review.replyAt = new Date();
    return this.reviewRepository.save(review);
  }

  async updateStatus(
    reviewId: number,
    dto: UpdateReviewStatusDto,
    operatorId: number,
  ): Promise<Review> {
    const review = await this.findById(reviewId);
    review.status = dto.status;
    return this.reviewRepository.save(review);
  }

  async findById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['reviewer', 'reviewee', 'booking'],
    });

    if (!review) {
      throw new NotFoundException('评价不存在');
    }

    return review;
  }

  async findByUser(
    userId: number,
    asReviewer = false,
    page = 1,
    limit = 20,
  ): Promise<{ reviews: Review[]; total: number }> {
    const field = asReviewer ? 'reviewerId' : 'revieweeId';
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { [field]: userId, status: ReviewStatus.NORMAL },
      relations: ['reviewer', 'reviewee'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { reviews, total };
  }

  async getUserRating(userId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { rating: number; count: number }[];
  }> {
    const reviews = await this.reviewRepository.find({
      where: { revieweeId: userId, status: ReviewStatus.NORMAL },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
        : 0;

    const distribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter((r) => r.rating === rating).length,
    }));

    return {
      averageRating,
      totalReviews,
      ratingDistribution: distribution,
    };
  }

  private async updateUserRating(userId: number): Promise<void> {
    const { averageRating } = await this.getUserRating(userId);
  }
}
