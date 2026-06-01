import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CircleService } from '../src/modules/circle/circle.service';
import { Circle } from '../src/modules/circle/entities/circle.entity';
import { CircleMember } from '../src/modules/circle/entities/circle-member.entity';
import { MOCK_CIRCLE, MOCK_USER } from './mock-data';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CircleService', () => {
  let service: CircleService;
  let circleRepository: Partial<Repository<Circle>>;
  let memberRepository: Partial<Repository<CircleMember>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CircleService,
        {
          provide: getRepositoryToken(Circle),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CircleMember),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CircleService>(CircleService);
    circleRepository = module.get(getRepositoryToken(Circle));
    memberRepository = module.get(getRepositoryToken(CircleMember));
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('应该成功创建圈子', async () => {
      const createDto = {
        name: '测试圈子',
        type: 1,
        description: '测试描述',
      };

      const savedCircle = { ...MOCK_CIRCLE, ...createDto };
      
      jest.spyOn(circleRepository, 'create').mockReturnValue(savedCircle as Circle);
      jest.spyOn(circleRepository, 'save').mockResolvedValue(savedCircle as Circle);
      jest.spyOn(memberRepository, 'save').mockResolvedValue({} as CircleMember);

      const result = await service.create(1, createDto);

      expect(result.name).toBe('测试圈子');
      expect(result.ownerId).toBe(1);
      expect(circleRepository.save).toHaveBeenCalled();
      expect(memberRepository.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('应该返回圈子当找到时', async () => {
      jest.spyOn(circleRepository, 'findOne').mockResolvedValue(MOCK_CIRCLE as Circle);

      const result = await service.findById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('测试圈子');
    });

    it('应该抛出异常当未找到时', async () => {
      jest.spyOn(circleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMyCircles', () => {
    it('应该返回用户加入的圈子列表', async () => {
      const mockMembers = [
        { circle: { id: 1, name: '圈子 1' } },
        { circle: { id: 2, name: '圈子 2' } },
      ];

      jest.spyOn(memberRepository, 'find').mockResolvedValue(mockMembers as any);

      const result = await service.findMyCircles(1);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('圈子 1');
    });
  });

  describe('join', () => {
    it('应该成功加入公开圈子', async () => {
      jest.spyOn(circleRepository, 'findOne').mockResolvedValue({
        ...MOCK_CIRCLE,
        isPublic: 1,
      } as Circle);
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(memberRepository, 'count').mockResolvedValue(10);
      jest.spyOn(memberRepository, 'create').mockReturnValue({} as CircleMember);
      jest.spyOn(memberRepository, 'save').mockResolvedValue({} as CircleMember);

      const result = await service.join(1, 2, { remark: '申请加入' });

      expect(memberRepository.save).toHaveBeenCalled();
    });

    it('应该抛出异常当已加入时', async () => {
      jest.spyOn(circleRepository, 'findOne').mockResolvedValue(MOCK_CIRCLE as Circle);
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue({} as CircleMember);

      await expect(service.join(1, 1, {})).rejects.toThrow(BadRequestException);
    });
  });
});
