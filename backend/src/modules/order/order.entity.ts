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
import { Route } from '../route/route.entity';
import { Company } from '../company/company.entity';
import { Review } from '../review/review.entity';

@Entity('order')
@Unique(['order_no'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  order_no: string;

  @ManyToOne(() => Route, (route) => route.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Column()
  route_id: number;

  @ManyToOne(() => User, (user) => user.driverOrders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column()
  driver_id: number;

  @ManyToOne(() => User, (user) => user.passengerOrders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'passenger_id' })
  passenger: User;

  @Column()
  passenger_id: number;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ nullable: true })
  company_id: number;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pickup_address: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  dropoff_address: string;

  @Column({ type: 'tinyint' })
  seats_booked: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount: number;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'varchar', length: 256, nullable: true })
  passenger_cancel_reason: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  driver_cancel_reason: string;

  @CreateDateColumn()
  booked_at: Date;

  @Column({ type: 'datetime', nullable: true })
  confirmed_at: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelled_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
