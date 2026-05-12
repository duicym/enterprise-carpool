import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty({ message: '订单 ID 不能为空' })
  @Type(() => Number)
  @IsNumber()
  order_id: number;

  @IsNotEmpty({ message: '被评价人 ID 不能为空' })
  @Type(() => Number)
  @IsNumber()
  reviewee_id: number;

  @IsNotEmpty({ message: '评分不能为空' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  is_anonymous?: number;
}
