import { IsString, IsOptional, IsEnum, IsInt, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CircleType } from '../entities/circle.entity';

export class CreateCircleDto {
  @ApiProperty({ description: '圈子名称', maxLength: 128 })
  @IsString()
  @MaxLength(128)
  name: string;

  @ApiProperty({ description: '圈子类型', enum: CircleType })
  @IsEnum(CircleType)
  type: CircleType;

  @ApiPropertyOptional({ description: '圈子简介', maxLength: 512 })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;

  @ApiPropertyOptional({ description: '最大成员数', default: 500 })
  @IsOptional()
  @IsInt()
  @Min(10)
  maxMembers?: number;

  @ApiPropertyOptional({ description: '是否公开', default: 1 })
  @IsOptional()
  @IsInt()
  isPublic?: number;
}

export class UpdateCircleDto {
  @ApiPropertyOptional({ description: '圈子名称' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name?: string;

  @ApiPropertyOptional({ description: '圈子简介' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;

  @ApiPropertyOptional({ description: '封面图片' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ description: '最大成员数' })
  @IsOptional()
  @IsInt()
  @Min(10)
  maxMembers?: number;
}

export class JoinCircleDto {
  @ApiPropertyOptional({ description: '备注信息' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  remark?: string;
}

export class CircleMemberUpdateDto {
  @ApiProperty({ description: '成员角色', enum: [1, 2, 3] })
  @IsInt()
  role: number;

  @ApiProperty({ description: '成员状态', enum: [1, 2, 3] })
  @IsInt()
  status: number;
}
