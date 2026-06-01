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
import { EventParticipant } from './event-participant.entity';

export enum AllocationStatus {
  PENDING = 0,
  COMPLETED = 1,
}

@Entity('event')
@Index(['circle_id'])
@Index(['organizer_id'])
@Index(['start_time'])
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Circle, (circle) => circle.events)
  @JoinColumn({ name: 'circle_id' })
  circle: Circle;

  @Column({ type: 'bigint', name: 'circle_id' })
  circleId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @Column({ type: 'bigint', name: 'organizer_id' })
  organizerId: number;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 256 })
  locationAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  locationLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  locationLongitude: number;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime: Date;

  @Column({ type: 'datetime', nullable: true })
  registrationDeadline: Date;

  @Column({ type: 'int', default: 0 })
  totalParticipants: number;

  @Column({ type: 'int', default: 0 })
  driversCount: number;

  @Column({ type: 'int', default: 0 })
  passengersCount: number;

  @Column({ type: 'tinyint', default: AllocationStatus.PENDING })
  allocationStatus: AllocationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EventParticipant, (participant) => participant.event)
  participants: EventParticipant[];
}
