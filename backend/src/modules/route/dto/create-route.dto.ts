import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRouteDto {
  @IsNotEmpty({ message: '起点地址不能为空' })
  @IsString()
  start_address: string;

  @IsNotEmpty({ message: '起点纬度不能为空' })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  start_latitude: number;

  @IsNotEmpty({ message: '起点经度不能为空' })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  start_longitude: number;

  @IsNotEmpty({ message: '终点地址不能为空' })
  @IsString()
  end_address: string;

  @IsNotEmpty({ message: '终点纬度不能为空' })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  end_latitude: number;

  @IsNotEmpty({ message: '终点经度不能为空' })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  end_longitude: number;

  @IsNotEmpty({ message: '出发时间不能为空' })
  @IsString()
  departure_time: string;

  @IsNotEmpty({ message: '座位数不能为空' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  seat_count: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_per_seat?: number;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsNotEmpty({ message: '发布日期不能为空' })
  @IsDateString()
  publish_date: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  company_id?: number;
}
