import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserCompany } from './user-company.entity';
import { Route } from '../route/route.entity';
import { Order } from '../order/order.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  domain: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => UserCompany, (uc) => uc.company)
  userCompanies: UserCompany[];

  @OneToMany(() => Route, (route) => route.company)
  routes: Route[];

  @OneToMany(() => Order, (order) => order.company)
  orders: Order[];
}
