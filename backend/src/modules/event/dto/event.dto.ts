import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EventParticipantRole } from '../entities/event-participant.entity';

export class CreateEventDto {
  @ApiProperty({ description: '活动标题', minLength: 1, maxLength: 128 })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  title: string;

  @ApiPropertyOptional({ description: '活动详情' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '活动地址' })
  @IsString()
  locationAddress: string;

  @ApiProperty({ description: '活动地点纬度' })
  @IsNumber()
  locationLatitude: number;

  @ApiProperty({ description: '活动地点经度' })
  @IsNumber()
  locationLongitude: number;

  @ApiProperty({ description: '开始时间' })
  @IsDateString()
  @Type(() => Date)
  startTime: Date;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  endTime?: Date;

  @ApiPropertyOptional({ description: '报名截止时间' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  registrationDeadline?: Date;
}

export class UpdateEventDto {
  @ApiPropertyOptional({ description: '活动标题' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  title?: string;

  @ApiPropertyOptional({ description: '活动详情' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '活动地址' })
  @IsOptional()
  @IsString()
  locationAddress?: string;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  startTime?: Date;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  endTime?: Date;
}

export class JoinEventDto {
  @ApiProperty({ description: '参与角色', enum: EventParticipantRole })
  @IsEnum(EventParticipantRole)
  role: EventParticipantRole;

  @ApiPropertyOptional({ description: '提供座位数 (车主必填)' })
  @IsOptional()
  @IsNumber()
  seatsOffered?: number;

  @ApiPropertyOptional({ description: '车辆信息 (车主选填)' })
  @IsOptional()
  @IsString()
  vehicleInfo?: string;

  @ApiPropertyOptional({ description: '上车点偏好' })
  @IsOptional()
  @IsString()
  pickupPreference?: string;
}

export class AllocateEventDto {
  @ApiPropertyOptional({ description: '是否优先同部门', default: false })
  @IsOptional()
  sameDepartmentPriority?: boolean;
}
