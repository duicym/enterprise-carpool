import { IsOptional, IsString } from 'class-validator';

export class SearchCompanyDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
