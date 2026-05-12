import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SubmitCompanyDto {
  @IsNotEmpty({ message: '企业名称不能为空' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  employee_id?: string;

  @IsNotEmpty({ message: '在职证明 URL 不能为空' })
  @IsString()
  certificate_url: string;
}
