import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Circle } from './circle.entity';
import { User } from '../../user/entities/user.entity';

export enum CircleMemberRole {
  OWNER = 1,
  ADMIN = 2,
  MEMBER = 3,
}

export enum CircleMemberStatus {
  NORMAL = 1,
  LEFT = 2,
  DISABLED = 3,
}

@Entity('circle_member')
@Unique(['circle', 'user'])
export class CircleMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Circle, (circle) => circle.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'circle_id' })
  circle: Circle;

  @Column({ type: 'bigint', name: 'circle_id' })
  circleId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'tinyint', default: CircleMemberRole.MEMBER })
  role: CircleMemberRole;

  @Column({ type: 'tinyint', default: CircleMemberStatus.NORMAL })
  status: CircleMemberStatus;

  @Column({ type: 'varchar', length: 256, nullable: true })
  remark: string;

  @CreateDateColumn()
  joinedAt: Date;
}
