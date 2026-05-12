import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserCompany } from '../company/user-company.entity';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCompany, User, Company])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
