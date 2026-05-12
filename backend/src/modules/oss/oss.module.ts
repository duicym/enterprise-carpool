import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OssService } from './oss.service';
import { OssController } from './oss.controller';
import { AdminModule } from '../admin/admin.module';
import { UserCompany } from '../company/user-company.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserCompany]), AdminModule],
  controllers: [OssController],
  providers: [OssService],
  exports: [OssService],
})
export class OssModule {}
