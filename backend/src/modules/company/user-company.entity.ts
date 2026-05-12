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
import { Company } from '../company/company.entity';

@Entity('user_company')
@Unique(['user', 'company'])
export class UserCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userCompanies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => Company, (company) => company.userCompanies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  employee_id: string;

  @Column({ type: 'varchar', length: 512 })
  certificate_url: string;

  @Column({ type: 'tinyint', default: 0 })
  audit_status: number;

  @Column({ type: 'varchar', length: 256, nullable: true })
  audit_remark: string;

  @Column({ type: 'datetime', nullable: true })
  audited_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
