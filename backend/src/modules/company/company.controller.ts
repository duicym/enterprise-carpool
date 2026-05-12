import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SearchCompanyDto } from './dto/search-company.dto';
import { SubmitCompanyDto } from './dto/submit-company.dto';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get('search')
  async search(@Query() searchDto: SearchCompanyDto) {
    const companies = await this.companyService.searchByName(searchDto.keyword || '');
    return {
      code: 0,
      message: 'success',
      data: companies,
    };
  }

  @Post('submit')
  async submit(@Req() request: any, @Body() submitDto: SubmitCompanyDto) {
    const result = await this.companyService.submitCompany(request.user.userId, submitDto);
    return {
      code: 0,
      message: '提交成功，请等待审核',
      data: result,
    };
  }

  @Get('detail/:id')
  async getDetail(@Param('id') id: number) {
    const company = await this.companyService.getCompanyDetail(id);
    return {
      code: 0,
      message: 'success',
      data: company,
    };
  }

  @Get('members/:id')
  async getMembers(@Param('id') id: number) {
    const members = await this.companyService.getCompanyMembers(id);
    return {
      code: 0,
      message: 'success',
      data: members,
    };
  }
}
