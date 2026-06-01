import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Trip, TripStatus, FeeMode } from '../../trip/entities/trip.entity';
import { CreateBookingDto, CancelBookingDto, RejectBookingDto } from '../dto/booking.dto';
import { CircleService } from '../../circle/circle.service';
import { TripService } from '../../trip/trip.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    private circleService: CircleService,
    private tripService: TripService,
    private dataSource: DataSource,
  ) {}

  async create(
    tripId: number,
    passengerId: number,
    dto: CreateBookingDto,
  ): Promise<Booking> {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['driver'],
    });

    if (!trip) {
      throw new NotFoundException('行程不存在');
    }

    if (trip.status !== TripStatus.RECRUITING) {
      throw new BadRequestException('行程已开始或已取消');
    }

    if (trip.availableSeats < dto.seatsBooked) {
      throw new BadRequestException('座位不足');
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        tripId,
        passengerId,
        status: BookingStatus.PENDING,
      },
    });

    if (existingBooking) {
      throw new ConflictException('已有待确认的预约');
    }

    const feeAmount = this.calculateFee(trip, dto.seatsBooked);

    const booking = this.bookingRepository.create({
      tripId,
      driverId: trip.driverId,
      passengerId,
      seatsBooked: dto.seatsBooked,
      feeAmount,
      status: trip.feeMode === FeeMode.FREE ? BookingStatus.CONFIRMED : BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    if (trip.feeMode === FeeMode.FREE) {
      await this.tripService.updateAvailableSeats(tripId, trip.availableSeats - dto.seatsBooked);
    }

    return savedBooking;
  }

  async confirm(bookingId: number, driverId: number): Promise<Booking> {
    const booking = await this.findById(bookingId);

    if (booking.driverId !== driverId) {
      throw new ForbiddenException('无权限确认该预约');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('预约状态不正确');
    }

    const trip = await this.tripRepository.findOne({ where: { id: booking.tripId } });
    if (!trip || trip.status !== TripStatus.RECRUITING) {
      throw new BadRequestException('行程状态不支持确认');
    }

    booking.status = BookingStatus.CONFIRMED;
    booking.confirmedAt = new Date();
    await this.bookingRepository.save(booking);

    await this.tripService.updateAvailableSeats(booking.tripId, trip.availableSeats - booking.seatsBooked);

    return booking;
  }

  async cancel(bookingId: number, passengerId: number, reason: string): Promise<void> {
    const booking = await this.findById(bookingId);

    if (booking.passengerId !== passengerId) {
      throw new ForbiddenException('无权限取消该预约');
    }

    if ([BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.REJECTED].includes(booking.status)) {
      throw new BadRequestException('预约状态不可取消');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.passengerCancelReason = reason;
    booking.cancelledAt = new Date();
    await this.bookingRepository.save(booking);

    const trip = await this.tripRepository.findOne({ where: { id: booking.tripId } });
    if (trip && trip.status === TripStatus.RECRUITING) {
      await this.tripService.updateAvailableSeats(booking.tripId, trip.availableSeats + booking.seatsBooked);
    }
  }

  async reject(bookingId: number, driverId: number, reason?: string): Promise<void> {
    const booking = await this.findById(bookingId);

    if (booking.driverId !== driverId) {
      throw new ForbiddenException('无权限拒绝该预约');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('预约状态不正确');
    }

    booking.status = BookingStatus.REJECTED;
    booking.driverCancelReason = reason || '车主拒绝';
    booking.cancelledAt = new Date();
    await this.bookingRepository.save(booking);
  }

  async complete(bookingId: number, userId: number): Promise<void> {
    const booking = await this.findById(bookingId);

    if (booking.driverId !== userId && booking.passengerId !== userId) {
      throw new ForbiddenException('无权限完成该预约');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('预约未确认');
    }

    booking.status = BookingStatus.COMPLETED;
    booking.completedAt = new Date();
    await this.bookingRepository.save(booking);

    await this.tripService.updateStatus(booking.tripId, TripStatus.COMPLETED);
  }

  async findById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['trip', 'driver', 'passenger'],
    });

    if (!booking) {
      throw new NotFoundException('预约不存在');
    }

    return booking;
  }

  async findByUser(userId: number, status?: BookingStatus): Promise<Booking[]> {
    const qb = this.bookingRepository.createQueryBuilder('booking');
    
    qb.where('booking.driverId = :userId OR booking.passengerId = :userId', { userId });
    
    if (status !== undefined) {
      qb.andWhere('booking.status = :status', { status });
    }

    qb.orderBy('booking.bookedAt', 'DESC');
    qb.take(50);

    return qb.getMany();
  }

  async findByTrip(tripId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { tripId },
      relations: ['passenger'],
      order: { bookedAt: 'ASC' },
    });
  }

  private calculateFee(trip: Trip, seats: number): number | null {
    if (trip.feeMode === FeeMode.FREE) {
      return null;
    }
    
    if (!trip.feeAmount) {
      return null;
    }

    return trip.feeAmount * seats;
  }
}
