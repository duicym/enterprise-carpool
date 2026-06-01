import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({ description: '预约座位数', default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  seatsBooked: number;

  @ApiPropertyOptional({ description: '备注信息' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  remark?: string;
}

export class ConfirmBookingDto {
  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class CancelBookingDto {
  @ApiProperty({ description: '取消原因' })
  @IsString()
  @MaxLength(256)
  reason: string;
}

export class RejectBookingDto {
  @ApiPropertyOptional({ description: '拒绝原因' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  reason?: string;
}
