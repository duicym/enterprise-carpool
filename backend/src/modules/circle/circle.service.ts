import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Circle, CircleType, CircleStatus } from '../entities/circle.entity';
import { CircleMember, CircleMemberRole, CircleMemberStatus } from '../entities/circle-member.entity';
import { CreateCircleDto, UpdateCircleDto, JoinCircleDto, CircleMemberUpdateDto } from '../dto/circle.dto';

@Injectable()
export class CircleService {
  constructor(
    @InjectRepository(Circle)
    private circleRepository: Repository<Circle>,
    @InjectRepository(CircleMember)
    private memberRepository: Repository<CircleMember>,
  ) {}

  async create(userId: number, dto: CreateCircleDto): Promise<Circle> {
    const circle = this.circleRepository.create({
      ...dto,
      ownerId: userId,
      memberCount: 1,
    });

    const savedCircle = await this.circleRepository.save(circle);

    await this.memberRepository.save({
      circleId: savedCircle.id,
      userId,
      role: CircleMemberRole.OWNER,
      status: CircleMemberStatus.NORMAL,
    });

    return savedCircle;
  }

  async findById(id: number): Promise<Circle> {
    const circle = await this.circleRepository.findOne({ where: { id } });
    if (!circle) {
      throw new NotFoundException('圈子不存在');
    }
    return circle;
  }

  async findByOwner(userId: number): Promise<Circle[]> {
    return this.circleRepository.find({ where: { ownerId: userId } });
  }

  async findMyCircles(userId: number): Promise<Circle[]> {
    const members = await this.memberRepository.find({
      where: { userId, status: CircleMemberStatus.NORMAL },
      relations: ['circle'],
    });
    return members.map((m) => m.circle);
  }

  async search(
    userId: number,
    filters: {
      keyword?: string;
      type?: CircleType;
      isPublic?: number;
    },
  ): Promise<Circle[]> {
    const qb = this.circleRepository.createQueryBuilder('circle');
    
    qb.innerJoin('circle_member', 'member', 'member.circle_id = circle.id AND member.user_id = :userId', { userId });
    qb.where('member.status = :status', { status: CircleMemberStatus.NORMAL });

    if (filters.keyword) {
      qb.andWhere(new Brackets((qb) => {
        qb.where('circle.name LIKE :keyword', { keyword: `%${filters.keyword}%` })
          .orWhere('circle.description LIKE :keyword', { keyword: `%${filters.keyword}%` });
      }));
    }

    if (filters.type) {
      qb.andWhere('circle.type = :type', { type: filters.type });
    }

    if (filters.isPublic !== undefined) {
      qb.andWhere('circle.isPublic = :isPublic', { isPublic: filters.isPublic });
    }

    return qb.getMany();
  }

  async update(id: number, dto: UpdateCircleDto, userId: number): Promise<Circle> {
    const circle = await this.findById(id);
    const member = await this.getMember(circle.id, userId);

    if (member.role !== CircleMemberRole.OWNER && member.role !== CircleMemberRole.ADMIN) {
      throw new ForbiddenException('无权限修改圈子');
    }

    Object.assign(circle, dto);
    return this.circleRepository.save(circle);
  }

  async delete(id: number, userId: number): Promise<void> {
    const circle = await this.findById(id);
    
    if (circle.ownerId !== userId) {
      throw new ForbiddenException('只有圈主可以删除圈子');
    }

    await this.circleRepository.delete(id);
  }

  async join(circleId: number, userId: number, dto: JoinCircleDto): Promise<CircleMember> {
    const circle = await this.findById(circleId);
    const existing = await this.getMember(circleId, userId, false);

    if (existing) {
      throw new BadRequestException('已加入该圈子');
    }

    const memberCount = await this.memberRepository.count({
      where: { circleId, status: CircleMemberStatus.NORMAL },
    });

    if (memberCount >= circle.maxMembers) {
      throw new BadRequestException('圈子成员已满');
    }

    const member = this.memberRepository.create({
      circleId,
      userId,
      role: CircleMemberRole.MEMBER,
      status: circle.isPublic === 1 ? CircleMemberStatus.NORMAL : CircleMemberStatus.LEFT,
      remark: dto.remark,
    });

    if (circle.isPublic !== 1) {
      await this.updateMemberCount(circleId);
    }

    return this.memberRepository.save(member);
  }

  async getMembers(circleId: number): Promise<CircleMember[]> {
    return this.memberRepository.find({
      where: { circleId, status: CircleMemberStatus.NORMAL },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }

  async updateMember(
    circleId: number,
    userId: number,
    dto: CircleMemberUpdateDto,
    operatorId: number,
  ): Promise<CircleMember> {
    const circle = await this.findById(circleId);
    const operator = await this.getMember(circleId, operatorId);

    if (operator.role !== CircleMemberRole.OWNER && operator.role !== CircleMemberRole.ADMIN) {
      throw new ForbiddenException('无权限管理成员');
    }

    const member = await this.getMember(circleId, userId);
    if (!member) {
      throw new NotFoundException('成员不存在');
    }

    Object.assign(member, dto);
    return this.memberRepository.save(member);
  }

  async leave(circleId: number, userId: number): Promise<void> {
    const member = await this.getMember(circleId, userId);
    if (!member) {
      throw new NotFoundException('未加入该圈子');
    }

    if (member.role === CircleMemberRole.OWNER) {
      throw new BadRequestException('圈主不能离开，请先转让圈主身份');
    }

    member.status = CircleMemberStatus.LEFT;
    await this.memberRepository.save(member);
    await this.updateMemberCount(circleId);
  }

  async removeMember(circleId: number, userId: number, operatorId: number): Promise<void> {
    const circle = await this.findById(circleId);
    const operator = await this.getMember(circleId, operatorId);

    if (operator.role !== CircleMemberRole.OWNER && operator.role !== CircleMemberRole.ADMIN) {
      throw new ForbiddenException('无权限移除成员');
    }

    const member = await this.getMember(circleId, userId);
    if (!member) {
      throw new NotFoundException('成员不存在');
    }

    if (member.role === CircleMemberRole.OWNER) {
      throw new BadRequestException('不能移除圈主');
    }

    member.status = CircleMemberStatus.DISABLED;
    await this.memberRepository.save(member);
    await this.updateMemberCount(circleId);
  }

  async getMember(circleId: number, userId: number, throwError = true): Promise<CircleMember | null> {
    const member = await this.memberRepository.findOne({
      where: { circleId, userId },
      relations: ['circle'],
    });

    if (!member && throwError) {
      throw new NotFoundException('不是圈子成员');
    }

    return member;
  }

  async checkMemberPermission(circleId: number, userId: number): Promise<void> {
    const member = await this.getMember(circleId, userId);
    if (member.status !== CircleMemberStatus.NORMAL) {
      throw new ForbiddenException('无权限访问');
    }
  }

  private async updateMemberCount(circleId: number): Promise<void> {
    const count = await this.memberRepository.count({
      where: { circleId, status: CircleMemberStatus.NORMAL },
    });
    await this.circleRepository.update(circleId, { memberCount: count });
  }
}
