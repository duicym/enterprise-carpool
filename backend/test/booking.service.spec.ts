import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingService } from '../src/modules/booking/booking.service';
import { Booking } from '../src/modules/booking/entities/booking.entity';
import { Trip } from '../src/modules/trip/entities/trip.entity';
import { MOCK_BOOKING, MOCK_TRIP } from './mock-data';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: Partial<Repository<Booking>>;
  let tripRepository: Partial<Repository<Trip>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Trip),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get(getRepositoryToken(Booking));
    tripRepository = module.get(getRepositoryToken(Trip));
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('应该成功创建预约 (免费模式)', async () => {
      const mockTrip = {
        ...MOCK_TRIP,
        feeMode: 1,
        availableSeats: 3,
        driver: { id: 1 },
      };

      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(mockTrip as Trip);
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bookingRepository, 'create').mockReturnValue({} as Booking);
      jest.spyOn(bookingRepository, 'save').mockResolvedValue(MOCK_BOOKING as Booking);

      const result = await service.create(1, 2, { seatsBooked: 1 });

      expect(result).toBeDefined();
      expect(result.status).toBe(1);
      expect(bookingRepository.save).toHaveBeenCalled();
    });

    it('应该抛出异常当座位不足时', async () => {
      const mockTrip = {
        ...MOCK_TRIP,
        availableSeats: 0,
      };

      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(mockTrip as Trip);

      await expect(service.create(1, 2, { seatsBooked: 1 })).rejects.toThrow(BadRequestException);
    });

    it('应该抛出异常当已有待确认预约时', async () => {
      const mockTrip = { ...MOCK_TRIP, availableSeats: 3 };
      const existingBooking = { ...MOCK_BOOKING, status: 0 };

      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(mockTrip as Trip);
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(existingBooking as Booking);

      await expect(service.create(1, 2, { seatsBooked: 1 })).rejects.toThrow(ConflictException);
    });
  });

  describe('confirm', () => {
    it('应该成功确认预约', async () => {
      const mockBooking = {
        ...MOCK_BOOKING,
        status: 0,
        driverId: 1,
      };

      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(mockBooking as Booking);
      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(MOCK_TRIP as Trip);
      jest.spyOn(bookingRepository, 'save').mockResolvedValue(mockBooking as Booking);

      const result = await service.confirm(1, 1);

      expect(result.status).toBe(1);
      expect(result.confirmedAt).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('应该成功取消预约', async () => {
      const mockBooking = {
        ...MOCK_BOOKING,
        passengerId: 2,
        status: 1,
      };

      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(mockBooking as Booking);
      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(MOCK_TRIP as Trip);
      jest.spyOn(bookingRepository, 'save').mockResolvedValue(mockBooking as Booking);

      await service.cancel(1, 2, '个人原因');

      expect(mockBooking.status).toBe(3);
      expect(mockBooking.passengerCancelReason).toBe('个人原因');
    });
  });
});
