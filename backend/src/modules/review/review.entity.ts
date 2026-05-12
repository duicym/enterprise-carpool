import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';

@Entity('review')
@Unique(['order_id'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  order_id: number;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column()
  reviewer_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewee_id' })
  reviewee: User;

  @Column()
  reviewee_id: number;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  reply_content: string;

  @Column({ type: 'datetime', nullable: true })
  reply_at: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_anonymous: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;
}
