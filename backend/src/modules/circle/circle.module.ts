
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Circle } from './entities/circle.entity';
import { CircleMember } from './entities/circle-member.entity';
import { User } from '../user/entities/user.entity';
import { CircleService } from './circle.service';
import { CircleController } from './circle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Circle, CircleMember, User])],
  controllers: [CircleController],
  providers: [CircleService],
  exports: [CircleService],
})
export class CircleModule {}
