import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserCompany } from '../company/user-company.entity';
import { Route } from '../route/route.entity';
import { Order } from '../order/order.entity';
import { Review } from '../review/review.entity';
import { Notification } from '../notification/notification.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  openid: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  unionid: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatar_url: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'tinyint', default: 0 })
  gender: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserCompany, (uc) => uc.user)
  userCompanies: UserCompany[];

  @OneToMany(() => Route, (route) => route.driver)
  routes: Route[];

  @OneToMany(() => Order, (order) => order.driver)
  driverOrders: Order[];

  @OneToMany(() => Order, (order) => order.passenger)
  passengerOrders: Order[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviews: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
