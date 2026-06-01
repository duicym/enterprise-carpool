import { IsInt, IsOptional, IsString, IsEnum, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReviewStatus } from '../entities/review.entity';

export class CreateReviewDto {
  @ApiProperty({ description: '评分 1-5 星', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiPropertyOptional({ description: '评价内容' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  content?: string;

  @ApiPropertyOptional({ description: '是否匿名', default: false })
  @IsOptional()
  @IsInt()
  isAnonymous?: number;
}

export class ReplyReviewDto {
  @ApiProperty({ description: '回复内容' })
  @IsString()
  @MaxLength(512)
  content: string;
}

export class UpdateReviewStatusDto {
  @ApiProperty({ description: '评价状态', enum: ReviewStatus })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}

export class ListReviewsDto {
  @ApiPropertyOptional({ description: '页数', default: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 20;
}
