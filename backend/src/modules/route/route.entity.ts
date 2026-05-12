import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { Order } from '../order/order.entity';

@Entity('route')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.routes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column()
  driver_id: number;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ nullable: true })
  company_id: number;

  @Column({ type: 'varchar', length: 256 })
  start_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  start_latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  start_longitude: number;

  @Column({ type: 'varchar', length: 256 })
  end_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  end_latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  end_longitude: number;

  @Column({ type: 'time' })
  departure_time: string;

  @Column({ type: 'tinyint' })
  seat_count: number;

  @Column({ type: 'tinyint' })
  available_seats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price_per_seat: number;

  @Column({ type: 'varchar', length: 16, nullable: true })
  frequency: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'date' })
  publish_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.route)
  orders: Order[];
}
