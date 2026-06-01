import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from '../../user/entities/user.entity';

export enum EventParticipantRole {
  DRIVER = 1,
  PASSENGER = 2,
  SELF_DRIVE = 3,
}

@Entity('event_participant')
@Index(['user_id'])
@Index(['role'])
@Unique(['event', 'user'])
export class EventParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ type: 'bigint', name: 'event_id' })
  eventId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'tinyint', default: EventParticipantRole.PASSENGER })
  role: EventParticipantRole;

  @Column({ type: 'tinyint', default: 0 })
  seatsOffered: number;

  @Column({ type: 'varchar', length: 256, nullable: true })
  vehicleInfo: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pickupPreference: string;

  @Column({ type: 'text', nullable: true })
  allocationResult: string;

  @CreateDateColumn()
  joinedAt: Date;
}
