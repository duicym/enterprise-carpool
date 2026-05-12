import { Controller, Get, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CertificateListQueryDto } from './dto/certificate-list-query.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('certificates')
  async getCertificates(@Query() query: CertificateListQueryDto) {
    const result = await this.adminService.getCertificates(query);
    return {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  @Put('certificate/:id')
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

  @Get('users')
  async getUsers(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    const result = await this.adminService.getUsers(page, pageSize);
    return {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  @Put('user/:id/status')
  async updateUserStatus(
    @Param('id') id: number,
    @Body() body: { status: number },
  ) {
    const result = await this.adminService.updateUserStatus(id, body.status);
    return {
      code: 0,
      message: '更新成功',
      data: result,
    };
  }
}
