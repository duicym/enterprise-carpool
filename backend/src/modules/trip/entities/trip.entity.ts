
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Circle } from '../../circle/entities/circle.entity';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';

export enum FeeMode {
  FREE = 1,
  AA = 2,
  PAID = 3,
}

export enum TripStatus {
  RECRUITING = 1,
  FULL = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
  CANCELLED = 5,
}

@Entity('trip')
@Index(['circle_id'])
@Index(['driver_id'])
@Index(['status'])
@Index(['departure_time'])
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Circle, (circle) => circle.trips)
  @JoinColumn({ name: 'circle_id' })
  circle: Circle;

  @Column({ type: 'bigint', name: 'circle_id' })
  circleId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'bigint', name: 'driver_id' })
  driverId: number;

  @Column({ type: 'varchar', length: 256 })
  startAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  startLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  startLongitude: number;

  @Column({ type: 'varchar', length: 256 })
  endAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  endLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  endLongitude: number;

  @Column({ type: 'datetime' })
  departureTime: Date;

  @Column({ type: 'tinyint' })
  seatCount: number;

  @Column({ type: 'tinyint' })
  availableSeats: number;

  @Column({ type: 'tinyint', default: FeeMode.FREE })
  feeMode: FeeMode;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  feeAmount: number;

  @Column({ type: 'tinyint', default: TripStatus.RECRUITING })
  status: TripStatus;

  @Column({ type: 'varchar', length: 512, nullable: true })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.trip)
  bookings: Booking[];
}
