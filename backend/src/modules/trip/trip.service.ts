
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { Trip, FeeMode, TripStatus } from '../entities/trip.entity';
import { CreateTripDto, UpdateTripDto, SearchTripsDto } from '../dto/trip.dto';
import { CircleService } from '../../circle/circle.service';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    private circleService: CircleService,
  ) {}

  async create(circleId: number, userId: number, dto: CreateTripDto): Promise<Trip> {
    await this.circleService.checkMemberPermission(circleId, userId);

    const trip = this.tripRepository.create({
      ...dto,
      circleId,
      driverId: userId,
      availableSeats: dto.seatCount,
    });

    return this.tripRepository.save(trip);
  }

  async findById(id: number): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['circle', 'driver', 'bookings'],
    });

    if (!trip) {
      throw new NotFoundException('行程不存在');
    }

    return trip;
  }

  async findByCircle(circleId: number, userId: number, filters?: SearchTripsDto): Promise<Trip[]> {
    await this.circleService.checkMemberPermission(circleId, userId);

    const qb = this.tripRepository.createQueryBuilder('trip');
    qb.where('trip.circleId = :circleId', { circleId });
    qb.andWhere('trip.status = :status', { status: TripStatus.RECRUITING });
    qb.andWhere('trip.departureTime > :now', { now: new Date() });
    qb.orderBy('trip.departureTime', 'ASC');

    if (filters?.startKeyword) {
      qb.andWhere('trip.startAddress LIKE :startKeyword', { 
        startKeyword: `%${filters.startKeyword}%` 
      });
    }

    if (filters?.endKeyword) {
      qb.andWhere('trip.endAddress LIKE :endKeyword', { 
        endKeyword: `%${filters.endKeyword}%` 
      });
    }

    if (filters?.date) {
      const startDate = new Date(filters.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(filters.date);
      endDate.setHours(23, 59, 59, 999);
      qb.andWhere('trip.departureTime BETWEEN :start AND :end', { 
        start: startDate, 
        end: endDate 
      });
    }

    if (filters?.feeMode) {
      qb.andWhere('trip.feeMode = :feeMode', { feeMode: filters.feeMode });
    }

    return qb.getMany();
  }

  async findByDriver(driverId: number): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { driverId },
      order: { departureTime: 'DESC' },
    });
  }

  async update(id: number, userId: number, dto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findById(id);

    if (trip.driverId !== userId) {
      throw new ForbiddenException('无权限修改行程');
    }

    if (trip.status !== TripStatus.RECRUITING) {
      throw new BadRequestException('行程已开始，无法修改');
    }

    if (dto.seatCount !== undefined) {
      const bookedSeats = trip.seatCount - trip.availableSeats;
      if (dto.seatCount < bookedSeats) {
        throw new BadRequestException('座位数不能小于已预约座位数');
      }
      trip.availableSeats = dto.seatCount - bookedSeats;
    }

    Object.assign(trip, dto);
    return this.tripRepository.save(trip);
  }

  async cancel(id: number, userId: number): Promise<void> {
    const trip = await this.findById(id);

    if (trip.driverId !== userId) {
      throw new ForbiddenException('无权限取消行程');
    }

    if (trip.status !== TripStatus.RECRUITING) {
      throw new BadRequestException('行程已开始，无法取消');
    }

    trip.status = TripStatus.CANCELLED;
    await this.tripRepository.save(trip);
  }

  async updateAvailableSeats(id: number, seats: number): Promise<void> {
    await this.tripRepository.update(id, { availableSeats: seats });
    
    if (seats === 0) {
      await this.updateStatus(id, TripStatus.FULL);
    }
  }

  async updateStatus(id: number, status: TripStatus): Promise<void> {
    await this.tripRepository.update(id, { status });
  }
}
