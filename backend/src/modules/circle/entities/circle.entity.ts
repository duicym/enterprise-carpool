import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CircleMember } from './circle-member.entity';
import { Trip } from '../../trip/entities/trip.entity';
import { Event } from '../../event/entities/event.entity';

export enum CircleType {
  COMPANY_COMMUTE = 1,
  NEIGHBORHOOD = 2,
  ALUMNI = 3,
  TEAM_EVENT = 4,
  OTHER = 5,
}

export enum CircleStatus {
  NORMAL = 1,
  DISABLED = 2,
}

@Entity('circle')
export class Circle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'tinyint' })
  type: CircleType;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  coverImage: string;

  @Column({ type: 'bigint' })
  ownerId: number;

  @Column({ type: 'int', default: 1 })
  memberCount: number;

  @Column({ type: 'int', default: 500 })
  maxMembers: number;

  @Column({ type: 'tinyint', default: 1 })
  isPublic: number;

  @Column({ type: 'tinyint', default: 1 })
  status: CircleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CircleMember, (member) => member.circle)
  members: CircleMember[];

  @OneToMany(() => Trip, (trip) => trip.circle)
  trips: Trip[];

  @OneToMany(() => Event, (event) => event.circle)
  events: Event[];
}
