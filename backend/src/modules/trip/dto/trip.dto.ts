
import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FeeMode } from '../entities/trip.entity';

export class CreateTripDto {
  @ApiProperty({ description: '起点地址' })
  @IsString()
  startAddress: string;

  @ApiProperty({ description: '起点纬度' })
  @IsNumber()
  startLatitude: number;

  @ApiProperty({ description: '起点经度' })
  @IsNumber()
  startLongitude: number;

  @ApiProperty({ description: '终点地址' })
  @IsString()
  endAddress: string;

  @ApiProperty({ description: '终点纬度' })
  @IsNumber()
  endLatitude: number;

  @ApiProperty({ description: '终点经度' })
  @IsNumber()
  endLongitude: number;

  @ApiProperty({ description: '出发时间' })
  @IsDateString()
  @Type(() => Date)
  departureTime: Date;

  @ApiProperty({ description: '座位数', minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  seatCount: number;

  @ApiPropertyOptional({ description: '费用模式', enum: FeeMode, default: FeeMode.FREE })
  @IsOptional()
  @IsEnum(FeeMode)
  feeMode?: FeeMode;

  @ApiPropertyOptional({ description: '费用金额' })
  @IsOptional()
  @IsNumber()
  feeAmount?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateTripDto {
  @ApiPropertyOptional({ description: '起点地址' })
  @IsOptional()
  @IsString()
  startAddress?: string;

  @ApiPropertyOptional({ description: '终点地址' })
  @IsOptional()
  @IsString()
  endAddress?: string;

  @ApiPropertyOptional({ description: '出发时间' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  departureTime?: Date;

  @ApiPropertyOptional({ description: '座位数' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  seatCount?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class SearchTripsDto {
  @ApiPropertyOptional({ description: '起点关键词' })
  @IsOptional()
  @IsString()
  startKeyword?: string;

  @ApiPropertyOptional({ description: '终点关键词' })
  @IsOptional()
  @IsString()
  endKeyword?: string;

  @ApiPropertyOptional({ description: '出发日期' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional({ description: '费用模式' })
  @IsOptional()
  @IsEnum(FeeMode)
  feeMode?: FeeMode;
}
