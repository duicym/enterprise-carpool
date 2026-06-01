import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Trip } from '../../trip/entities/trip.entity';
import { User } from '../../user/entities/user.entity';

export enum BookingStatus {
  PENDING = 0,
  CONFIRMED = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  REJECTED = 4,
  NO_SHOW = 5,
}

@Entity('booking')
@Index(['trip_id'])
@Index(['driver_id'])
@Index(['passenger_id'])
@Index(['status'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trip, (trip) => trip.bookings)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ type: 'bigint', name: 'trip_id' })
  tripId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'bigint', name: 'driver_id' })
  driverId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'passenger_id' })
  passenger: User;

  @Column({ type: 'bigint', name: 'passenger_id' })
  passengerId: number;

  @Column({ type: 'tinyint', default: 1 })
  seatsBooked: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  feeAmount: number;

  @Column({ type: 'tinyint', default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'varchar', length: 256, nullable: true })
  passengerCancelReason: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  driverCancelReason: string;

  @CreateDateColumn()
  bookedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt: Date;
}
