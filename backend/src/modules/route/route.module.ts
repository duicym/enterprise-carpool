import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { Route } from './route.entity';
import { Company } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Company])],
  controllers: [RouteController],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}
