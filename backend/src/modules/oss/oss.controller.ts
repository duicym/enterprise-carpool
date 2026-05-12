import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AdminService } from '../admin/admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class OssController {
  constructor(
    private ossService: OssService,
    private adminService: AdminService,
  ) {}

  @Post('certificate/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('只支持 JPG、PNG、GIF、WEBP 格式'), false);
        }
      },
    }),
  )
  async uploadCertificate(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('未上传文件');
    }

    const url = await this.ossService.uploadFile(file, 'certificates');
    
    return {
      code: 0,
      message: '上传成功',
      data: {
        url,
        filename: file.originalname,
        size: file.size,
      },
    };
  }

  @Put('certificate/:id/audit')
  async auditCertificate(
    @Param('id') id: number,
    @Body() body: { audit_status: number; audit_remark?: string },
  ) {
    const result = await this.adminService.auditCertificate(id, body.audit_status, body.audit_remark);
    return {
      code: 0,
      message: '审核成功',
      data: result,
    };
  }
}
