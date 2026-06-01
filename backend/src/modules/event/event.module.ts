import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventParticipant } from './entities/event-participant.entity';
import { CircleModule } from '../../circle/circle.module';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventParticipant]),
    CircleModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
