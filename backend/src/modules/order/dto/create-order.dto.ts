import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty({ message: '路线 ID 不能为空' })
  @Type(() => Number)
  @IsNumber()
  route_id: number;

  @IsNotEmpty({ message: '预约座位数不能为空' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  seats_booked: number;

  @IsOptional()
  @IsString()
  pickup_address?: string;

  @IsOptional()
  @IsString()
  dropoff_address?: string;
}
