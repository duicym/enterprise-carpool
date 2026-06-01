import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripService } from '../src/modules/trip/trip.service';
import { Trip, TripStatus, FeeMode } from '../src/modules/trip/entities/trip.entity';
import { Circle } from '../src/modules/circle/entities/circle.entity';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TripService', () => {
  let service: TripService;
  let tripRepository: Partial<Repository<Trip>>;
  let circleRepository: Partial<Repository<Circle>>;

  const MOCK_TRIP = {
    id: 1,
    circleId: 1,
    driverId: 1,
    startAddress: '北京市朝阳区',
    startLatitude: 39.9042,
    startLongitude: 116.4074,
    endAddress: '北京市海淀区',
    endLatitude: 39.9593,
    endLongitude: 116.2988,
    departureTime: new Date('2025-06-10 09:00:00'),
    seatCount: 4,
    availableSeats: 3,
    feeMode: FeeMode.FREE,
    status: TripStatus.RECRUITING,
    circle: { id: 1, ownerId: 1, name: '测试圈子' } as Circle,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getRepositoryToken(Trip),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Circle),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TripService>(TripService);
    tripRepository = module.get(getRepositoryToken(Trip));
    circleRepository = module.get(getRepositoryToken(Circle));
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('应该成功创建行程', async () => {
      const createDto = {
        startAddress: '北京市朝阳区',
        endAddress: '北京市海淀区',
        departureTime: '2025-06-10 09:00:00',
        seatCount: 4,
        feeMode: FeeMode.FREE,
      };

      jest.spyOn(circleRepository, 'findOne').mockResolvedValue({ id: 1, ownerId: 1 } as any);
      jest.spyOn(tripRepository, 'create').mockReturnValue({
        ...MOCK_TRIP,
        ...createDto,
      } as Trip);
      jest.spyOn(tripRepository, 'save').mockResolvedValue(MOCK_TRIP as Trip);

      const result = await service.create(1, 1, createDto);

      expect(result.circleId).toBe(1);
      expect(result.driverId).toBe(1);
      expect(result.availableSeats).toBe(4);
      expect(tripRepository.save).toHaveBeenCalled();
    });

    it('应该抛出异常当圈子不存在时', async () => {
      jest.spyOn(circleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(1, 999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('应该返回行程详情', async () => {
      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(MOCK_TRIP as Trip);

      const result = await service.findById(1);

      expect(result.id).toBe(1);
      expect(result.startAddress).toBe('北京市朝阳区');
    });

    it('应该抛出异常当行程不存在时', async () => {
      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCircle', () => {
    it('应该返回圈子内的行程列表', async () => {
      const trips = [MOCK_TRIP, { ...MOCK_TRIP, id: 2 }];
      jest.spyOn(tripRepository, 'find').mockResolvedValue(trips as Trip[]);

      const result = await service.findByCircle(1, 1);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
    });
  });

  describe('findByDriver', () => {
    it('应该返回车主发布的行程列表', async () => {
      const trips = [MOCK_TRIP];
      jest.spyOn(tripRepository, 'find').mockResolvedValue(trips as Trip[]);

      const result = await service.findByDriver(1);

      expect(result).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('应该成功更新行程', async () => {
      const updateDto = { seatCount: 5, remark: '测试备注' };
      const updatedTrip = { ...MOCK_TRIP, ...updateDto };

      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(MOCK_TRIP as Trip);
      jest.spyOn(tripRepository, 'save').mockResolvedValue(updatedTrip as Trip);

      const result = await service.update(1, 1, updateDto);

      expect(result.seatCount).toBe(5);
      expect(result.remark).toBe('测试备注');
    });

    it('应该抛出异常当非车主尝试更新时', async () => {
      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(MOCK_TRIP as Trip);

      await expect(service.update(1, 999, {})).rejects.toThrow(ForbiddenException);
    });
  });

  describe('cancel', () => {
    it('应该成功取消行程', async () => {
      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(MOCK_TRIP as Trip);
      jest.spyOn(tripRepository, 'save').mockResolvedValue({
        ...MOCK_TRIP,
        status: TripStatus.CANCELLED,
      } as Trip);

      const result = await service.cancel(1, 1);

      expect(result.status).toBe(TripStatus.CANCELLED);
    });

    it('应该抛出异常当非车主尝试取消时', async () => {
      jest.spyOn(tripRepository, 'findOne').mockResolvedValue(MOCK_TRIP as Trip);

      await expect(service.cancel(1, 999)).rejects.toThrow(ForbiddenException);
    });
  });
});
