import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../src/modules/event/event.service';
import { Event, AllocationStatus } from '../src/modules/event/entities/event.entity';
import { EventParticipant } from '../src/modules/event/entities/event-participant.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EventService', () => {
  let service: EventService;
  let eventRepository: Partial<Repository<Event>>;
  let participantRepository: Partial<Repository<EventParticipant>>;

  const MOCK_EVENT = {
    id: 1,
    circleId: 1,
    organizerId: 1,
    title: '团建活动',
    description: '测试活动描述',
    locationAddress: '北京市朝阳区',
    startTime: new Date('2025-06-15 10:00:00'),
    totalParticipants: 5,
    driversCount: 2,
    passengersCount: 3,
    allocationStatus: AllocationStatus.PENDING,
  };

  const MOCK_PARTICIPANT = {
    id: 1,
    eventId: 1,
    userId: 1,
    isDriver: 1,
    seatsProvided: 3,
    status: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(EventParticipant),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get(getRepositoryToken(Event));
    participantRepository = module.get(getRepositoryToken(EventParticipant));
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('应该成功创建活动', async () => {
      const createDto = {
        title: '团建活动',
        locationAddress: '北京市朝阳区',
        startTime: '2025-06-15 10:00:00',
      };

      jest.spyOn(eventRepository, 'create').mockReturnValue({
        ...MOCK_EVENT,
        ...createDto,
      } as Event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(MOCK_EVENT as Event);
      jest.spyOn(participantRepository, 'create').mockReturnValue({} as EventParticipant);
      jest.spyOn(participantRepository, 'save').mockResolvedValue({} as EventParticipant);

      const result = await service.create(1, 1, createDto);

      expect(result.circleId).toBe(1);
      expect(result.organizerId).toBe(1);
      expect(result.allocationStatus).toBe(AllocationStatus.PENDING);
    });
  });

  describe('findById', () => {
    it('应该返回活动详情', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(MOCK_EVENT as Event);

      const result = await service.findById(1);

      expect(result.id).toBe(1);
      expect(result.title).toBe('团建活动');
    });

    it('应该抛出异常当活动不存在时', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCircle', () => {
    it('应该返回圈子内的活动列表', async () => {
      const events = [MOCK_EVENT, { ...MOCK_EVENT, id: 2 }];
      jest.spyOn(eventRepository, 'find').mockResolvedValue(events as Event[]);

      const result = await service.findByCircle(1);

      expect(result).toHaveLength(2);
    });
  });

  describe('join', () => {
    it('应该成功报名参加活动', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(MOCK_EVENT as Event);
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(participantRepository, 'create').mockReturnValue({} as EventParticipant);
      jest.spyOn(participantRepository, 'save').mockResolvedValue({} as EventParticipant);

      const result = await service.join(1, 1, { isDriver: 1, seatsProvided: 3 });

      expect(participantRepository.save).toHaveBeenCalled();
    });

    it('应该抛出异常当已报名且是车主时', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(MOCK_EVENT as Event);
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue({
        ...MOCK_PARTICIPANT,
        isDriver: 1,
      } as EventParticipant);

      await expect(service.join(1, 1, { isDriver: 1, seatsProvided: 3 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('leave', () => {
    it('应该成功退出活动', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(MOCK_EVENT as Event);
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue(MOCK_PARTICIPANT as EventParticipant);
      jest.spyOn(participantRepository, 'remove').mockResolvedValue(undefined);

      const result = await service.leave(1, 1);

      expect(participantRepository.remove).toHaveBeenCalled();
    });

    it('应该抛出异常当未报名时', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(MOCK_EVENT as Event);
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue(null);

      await expect(service.leave(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('allocate', () => {
    it('应该成功进行车辆分配', async () => {
      const participants = [
        { isDriver: 1, seatsProvided: 3, status: 1 },
        { isDriver: 0, seatsNeeded: 2, status: 1 },
      ];

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(MOCK_EVENT as Event);
      jest.spyOn(participantRepository, 'find').mockResolvedValue(participants as any);
      jest.spyOn(eventRepository, 'save').mockResolvedValue({
        ...MOCK_EVENT,
        allocationStatus: AllocationStatus.COMPLETED,
      } as Event);

      const result = await service.allocate(1, 1);

      expect(result).toBeDefined();
      expect(eventRepository.save).toHaveBeenCalled();
    });

    it('应该抛出异常当活动不存在时', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

      await expect(service.allocate(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('应该成功删除活动', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(MOCK_EVENT as Event);
      jest.spyOn(eventRepository, 'remove').mockResolvedValue(undefined);

      const result = await service.delete(1, 1);

      expect(eventRepository.remove).toHaveBeenCalled();
    });

    it('应该抛出异常当非组织者尝试删除时', async () => {
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(MOCK_EVENT as Event);

      await expect(service.delete(1, 999)).rejects.toThrow(BadRequestException);
    });
  });
});
