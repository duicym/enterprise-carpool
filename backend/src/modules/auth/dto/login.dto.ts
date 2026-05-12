import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '微信登录 code 不能为空' })
  @IsString()
  code: string;
}
