import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewService } from '../src/modules/review/review.service';
import { Review } from '../src/modules/review/entities/review.entity';
import { Booking } from '../src/modules/booking/entities/booking.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: Partial<Repository<Review>>;
  let bookingRepository: Partial<Repository<Booking>>;

  const MOCK_REVIEW = {
    id: 1,
    bookingId: 1,
    reviewerId: 1,
    revieweeId: 2,
    rating: 5,
    content: '很好的体验',
  };

  const MOCK_BOOKING = {
    id: 1,
    driverId: 1,
    passengerId: 2,
    status: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get(getRepositoryToken(Review));
    bookingRepository = module.get(getRepositoryToken(Booking));
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('应该成功创建评价', async () => {
      const createDto = {
        rating: 5,
        content: '很好的体验',
      };

      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(MOCK_BOOKING as Booking);
      jest.spyOn(reviewRepository, 'count').mockResolvedValue(0);
      jest.spyOn(reviewRepository, 'create').mockReturnValue({
        ...MOCK_REVIEW,
        ...createDto,
      } as Review);
      jest.spyOn(reviewRepository, 'save').mockResolvedValue(MOCK_REVIEW as Review);

      const result = await service.create(1, 2, createDto);

      expect(result.bookingId).toBe(1);
      expect(result.rating).toBe(5);
      expect(reviewRepository.save).toHaveBeenCalled();
    });

    it('应该抛出异常当 booking 不存在时', async () => {
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(999, 1, {})).rejects.toThrow(NotFoundException);
    });

    it('应该抛出异常当评价已存在时', async () => {
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(MOCK_BOOKING as Booking);
      jest.spyOn(reviewRepository, 'count').mockResolvedValue(1);

      await expect(service.create(1, 2, {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByUser', () => {
    it('应该返回用户收到的评价列表', async () => {
      jest.spyOn(reviewRepository, 'find').mockResolvedValue([MOCK_REVIEW] as Review[]);

      const result = await service.findByUser(1, 'received');

      expect(result).toHaveLength(1);
    });

    it('应该返回用户给出的评价列表', async () => {
      jest.spyOn(reviewRepository, 'find').mockResolvedValue([MOCK_REVIEW] as Review[]);

      const result = await service.findByUser(1, 'given');

      expect(result).toHaveLength(1);
    });
  });

  describe('getUserRating', () => {
    it('应该返回用户评分统计', async () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 5 },
      ];

      jest.spyOn(reviewRepository, 'find').mockResolvedValue(reviews as any);

      const result = await service.getUserRating(1);

      expect(result.averageRating).toBeDefined();
    });

    it('应该返回空统计当没有评价时', async () => {
      jest.spyOn(reviewRepository, 'find').mockResolvedValue([]);

      const result = await service.getUserRating(1);

      expect(result.totalReviews).toBe(0);
    });
  });
});
