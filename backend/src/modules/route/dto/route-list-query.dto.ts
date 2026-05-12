import { IsOptional, IsString, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RouteListQueryDto {
  @IsOptional()
  @IsString()
  start_address?: string;

  @IsOptional()
  @IsString()
  end_address?: string;

  @IsOptional()
  @IsDateString()
  publish_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 20;
}
