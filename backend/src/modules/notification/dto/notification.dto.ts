import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
  @ApiProperty({ description: '用户 ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: '通知类型 1-预约 2-圈子 3-行程 4-活动 5-系统' })
  @IsInt()
  type: number;

  @ApiProperty({ description: '标题' })
  @IsString()
  @MaxLength(128)
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @MaxLength(512)
  content: string;

  @ApiPropertyOptional({ description: '关联 ID' })
  @IsOptional()
  @IsInt()
  relatedId?: number;
}

export class MarkAsReadDto {
  @ApiProperty({ description: '通知 ID 列表' })
  @IsInt({ each: true })
  ids: number[];
}

export class ListNotificationsDto {
  @ApiPropertyOptional({ description: '通知类型筛选' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  type?: number;

  @ApiPropertyOptional({ description: '是否只读未读', default: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  unreadOnly?: boolean;

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
