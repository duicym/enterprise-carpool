import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../user/entities/user.entity';

export enum ReviewStatus {
  NORMAL = 1,
  HIDDEN = 2,
  PENDING_REVIEW = 3,
}

@Entity('review')
@Index(['reviewer_id'])
@Index(['reviewee_id'])
@Index(['booking_id'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ type: 'bigint', name: 'booking_id' })
  bookingId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column({ type: 'bigint', name: 'reviewer_id' })
  reviewerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewee_id' })
  reviewee: User;

  @Column({ type: 'bigint', name: 'reviewee_id' })
  revieweeId: number;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  replyContent: string;

  @Column({ type: 'datetime', nullable: true })
  replyAt: Date;

  @Column({ type: 'tinyint', default: 0 })
  isAnonymous: number;

  @Column({ type: 'tinyint', default: ReviewStatus.NORMAL })
  status: ReviewStatus;

  @CreateDateColumn()
  createdAt: Date;
}
