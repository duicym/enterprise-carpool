import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import COS from 'cos-nodejs-sdk-v5';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OssService {
  private cos: COS;
  private bucket: string;
  private region: string;

  constructor(private configService: ConfigService) {
    const secretId = this.configService.get<string>('COS_SECRET_ID');
    const secretKey = this.configService.get<string>('COS_SECRET_KEY');
    this.bucket = this.configService.get<string>('COS_BUCKET', 'carpool-123456');
    this.region = this.configService.get<string>('COS_REGION', 'ap-guangzhou');

    if (secretId && secretKey) {
      this.cos = new COS({
        SecretId: secretId,
        SecretKey: secretKey,
      });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    if (!this.cos) {
      throw new HttpException(
        { code: 1000, message: 'OSS 配置缺失' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const fileExt = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${fileExt}`;
    const key = `${folder}/${filename}`;

    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: key,
          Body: file.buffer,
        },
        (err, data) => {
          if (err) {
            reject(
              new HttpException(
                { code: 1000, message: '上传失败：' + err.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          } else {
            const baseUrl = this.configService.get<string>('COS_BASE_URL', '');
            const url = baseUrl
              ? `${baseUrl}/${key}`
              : `https://${this.bucket}.cos.${this.region}.myqcloud.com/${key}`;
            resolve(url);
          }
        },
      );
    });
  }

  async deleteFile(url: string): Promise<void> {
    if (!this.cos) {
      return;
    }

    const key = this.extractKeyFromUrl(url);
    if (!key) {
      return;
    }

    return new Promise((resolve) => {
      this.cos.deleteObject(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: key,
        },
        () => {
          resolve();
        },
      );
    });
  }

  private extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      return path.startsWith('/') ? path.substring(1) : path;
    } catch {
      return null;
    }
  }
}
