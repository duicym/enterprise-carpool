import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRouteDto {
  @IsOptional()
  @IsString()
  start_address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  start_latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  start_longitude?: number;

  @IsOptional()
  @IsString()
  end_address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  end_latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  end_longitude?: number;

  @IsOptional()
  @IsString()
  departure_time?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  seat_count?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_per_seat?: number;

  @IsOptional()
  @IsString()
  frequency?: string;
}
