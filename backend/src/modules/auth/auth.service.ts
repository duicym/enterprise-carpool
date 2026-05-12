import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from '../user/user.entity';
import { UserCompany } from '../company/user-company.entity';

export interface WechatLoginResponse {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class AuthService {
  private readonly wechatLoginUrl: string;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserCompany)
    private userCompanyRepository: Repository<UserCompany>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.wechatLoginUrl = this.configService.get<string>(
      'WECHAT_LOGIN_URL',
      'https://api.weixin.qq.com/sns/jscode2session',
    );
  }

  async wechatLogin(code: string): Promise<{ token: string; user: User; isNew: boolean }> {
    try {
      const appId = this.configService.get<string>('WECHAT_APP_ID');
      const appSecret = this.configService.get<string>('WECHAT_APP_SECRET');

      if (!appId || !appSecret) {
        throw new HttpException(
          { code: 2001, message: '微信配置缺失' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const url = `${this.wechatLoginUrl}?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
      const response = await axios.get<WechatLoginResponse>(url);
      const data = response.data;

      if (data.errcode) {
        throw new HttpException(
          { code: 2001, message: data.errmsg || '微信登录失败' },
          HttpStatus.BAD_REQUEST,
        );
      }

      let user = await this.userRepository.findOne({ where: { openid: data.openid } });
      const isNew = !user;

      if (isNew) {
        user = this.userRepository.create({
          openid: data.openid,
          unionid: data.unionid,
        });
        user = await this.userRepository.save(user);
      }

      if (!user) {
        throw new HttpException(
          { code: 2001, message: '用户创建失败' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const token = this.jwtService.sign({
        sub: user.id,
        openid: user.openid,
      });

      return { token, user, isNew };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { code: 2001, message: '微信登录失败，请稍后重试' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserProfile(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userCompanies', 'userCompanies.company'],
    });
  }

  async validateUser(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }
}
