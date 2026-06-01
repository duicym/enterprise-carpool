import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum NotificationType {
  BOOKING = 1,
  CIRCLE = 2,
  TRIP = 3,
  EVENT = 4,
  SYSTEM = 5,
}

@Entity('notification')
@Index(['user_id'])
@Index(['is_read'])
@Index(['type'])
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'tinyint' })
  type: NotificationType;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'varchar', length: 512 })
  content: string;

  @Column({ type: 'bigint', nullable: true })
  relatedId: number;

  @Column({ type: 'tinyint', default: 0 })
  isRead: number;

  @CreateDateColumn()
  createdAt: Date;
}
