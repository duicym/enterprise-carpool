import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Event, AllocationStatus } from '../entities/event.entity';
import { EventParticipant, EventParticipantRole } from '../entities/event-participant.entity';
import { CreateEventDto, UpdateEventDto, JoinEventDto, AllocateEventDto } from '../dto/event.dto';
import { CircleService } from '../../circle/circle.service';

interface AllocationResult {
  driver: {
    userId: number;
    userName: string;
    seatsOffered: number;
  };
  passengers: {
    userId: number;
    userName: number;
  }[];
  seatsUsed: number;
}

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventParticipant)
    private participantRepository: Repository<EventParticipant>,
    private circleService: CircleService,
    private dataSource: DataSource,
  ) {}

  async create(circleId: number, userId: number, dto: CreateEventDto): Promise<Event> {
    await this.circleService.checkMemberPermission(circleId, userId);

    const event = this.eventRepository.create({
      ...dto,
      circleId,
      organizerId: userId,
    });

    return this.eventRepository.save(event);
  }

  async findById(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants', 'participants.user'],
    });

    if (!event) {
      throw new NotFoundException('活动不存在');
    }

    return event;
  }

  async findByCircle(circleId: number): Promise<Event[]> {
    await this.circleService.checkMemberPermission(circleId, 0);

    return this.eventRepository.find({
      where: { circleId },
      order: { startTime: 'DESC' },
      take: 50,
    });
  }

  async update(id: number, userId: number, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findById(id);

    if (event.organizerId !== userId) {
      throw new ForbiddenException('无权限修改活动');
    }

    Object.assign(event, dto);
    return this.eventRepository.save(event);
  }

  async delete(id: number, userId: number): Promise<void> {
    const event = await this.findById(id);

    if (event.organizerId !== userId) {
      throw new ForbiddenException('无权限删除活动');
    }

    await this.eventRepository.delete(id);
  }

  async join(eventId: number, userId: number, dto: JoinEventDto): Promise<EventParticipant> {
    const event = await this.findById(eventId);

    const existing = await this.participantRepository.findOne({
      where: { eventId, userId },
    });

    if (existing) {
      throw new BadRequestException('已报名该活动');
    }

    if (dto.role === EventParticipantRole.DRIVER && dto.seatsOffered < 1) {
      throw new BadRequestException('车主至少提供 1 个座位');
    }

    const participant = this.participantRepository.create({
      eventId,
      userId,
      role: dto.role,
      seatsOffered: dto.seatsOffered || 0,
      vehicleInfo: dto.vehicleInfo,
      pickupPreference: dto.pickupPreference,
    });

    await this.participantRepository.save(participant);
    await this.updateParticipantCount(eventId);

    return participant;
  }

  async allocate(eventId: number, userId: number): Promise<AllocationResult[]> {
    const event = await this.findById(eventId);

    if (event.organizerId !== userId) {
      throw new ForbiddenException('无权限执行分配');
    }

    if (event.allocationStatus === AllocationStatus.COMPLETED) {
      throw new BadRequestException('已经分配过了');
    }

    const participants = await this.participantRepository.find({
      where: { eventId },
      relations: ['user'],
    });

    const drivers = participants.filter(p => p.role === EventParticipantRole.DRIVER);
    const passengers = participants.filter(p => p.role === EventParticipantRole.PASSENGER);

    const results: AllocationResult[] = [];
    const unassigned: EventParticipant[] = [];

    for (const driver of drivers) {
      const availableSeats = driver.seatsOffered - 1;
      const assignedPassengers: EventParticipant[] = [];

      while (assignedPassengers.length < availableSeats && passengers.length > 0) {
        const passenger = passengers.shift();
        if (passenger) {
          assignedPassengers.push(passenger);
        }
      }

      results.push({
        driver: {
          userId: driver.userId,
          userName: driver.user.nickname,
          seatsOffered: driver.seatsOffered,
        },
        passengers: assignedPassengers.map(p => ({
          userId: p.userId,
          userName: p.user.nickname,
        })),
        seatsUsed: assignedPassengers.length,
      });

      for (const p of assignedPassengers) {
        await this.participantRepository.update(p.id, {
          allocationResult: JSON.stringify({
            assignedDriverId: driver.userId,
            assignedDriverName: driver.user.nickname,
          }),
        });
      }

      await this.participantRepository.update(driver.id, {
        allocationResult: JSON.stringify({
          assignedPassengers: assignedPassengers.map(p => p.userId),
        }),
      });
    }

    unassigned.push(...passengers);
    const suggestedTaxis = Math.ceil(unassigned.length / 4);

    await this.eventRepository.update(eventId, {
      allocationStatus: AllocationStatus.COMPLETED,
    });

    return results;
  }

  async getAllocationResult(eventId: number): Promise<any> {
    const event = await this.findById(eventId);

    const participants = await this.participantRepository.find({
      where: { eventId },
      relations: ['user'],
    });

    const drivers = participants.filter(p => p.role === EventParticipantRole.DRIVER);
    const unassigned = participants.filter(
      p => p.role === EventParticipantRole.PASSENGER && !p.allocationResult,
    );

    return {
      status: event.allocationStatus === AllocationStatus.COMPLETED ? 'completed' : 'pending',
      drivers,
      unassignedCount: unassigned.length,
      suggestedTaxis: Math.ceil(unassigned.length / 4),
    };
  }

  async getParticipants(eventId: number): Promise<EventParticipant[]> {
    return this.participantRepository.find({
      where: { eventId },
      relations: ['user'],
      order: { role: 'ASC', joinedAt: 'ASC' },
    });
  }

  async leave(eventId: number, userId: number): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { eventId, userId },
    });

    if (!participant) {
      throw new NotFoundException('未报名该活动');
    }

    await this.participantRepository.remove(participant);
    await this.updateParticipantCount(eventId);
  }

  private async updateParticipantCount(eventId: number): Promise<void> {
    const [total, drivers, passengers] = await Promise.all([
      this.participantRepository.count({ where: { eventId } }),
      this.participantRepository.count({ where: { eventId, role: EventParticipantRole.DRIVER } }),
      this.participantRepository.count({ where: { eventId, role: EventParticipantRole.PASSENGER } }),
    ]);

    await this.eventRepository.update(eventId, {
      totalParticipants: total,
      driversCount: drivers,
      passengersCount: passengers,
    });
  }
}
