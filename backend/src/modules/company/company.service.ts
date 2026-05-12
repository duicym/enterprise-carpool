import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Company } from './company.entity';
import { UserCompany } from './user-company.entity';
import { SubmitCompanyDto } from './dto/submit-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(UserCompany)
    private userCompanyRepository: Repository<UserCompany>,
  ) {}

  async searchByName(keyword: string): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { 
        name: Like(`%${keyword}%`),
        status: 1,
      },
      take: 10,
    });
  }

  async submitCompany(userId: number, dto: SubmitCompanyDto): Promise<UserCompany> {
    let company = await this.companyRepository.findOne({
      where: { name: dto.name },
    });

    if (!company) {
      company = this.companyRepository.create({
        name: dto.name,
        full_name: dto.full_name,
        domain: dto.domain,
      });
      await this.companyRepository.save(company);
    }

    const existing = await this.userCompanyRepository.findOne({
      where: { user: { id: userId }, company: { id: company.id } },
    });

    if (existing) {
      throw new HttpException(
        { code: 6002, message: '您已加入该企业' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userCompany = this.userCompanyRepository.create({
      user: { id: userId },
      company: { id: company.id },
      employee_id: dto.employee_id,
      certificate_url: dto.certificate_url,
      audit_status: 0,
    });

    return await this.userCompanyRepository.save(userCompany);
  }

  async getCompanyDetail(id: number): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { id, status: 1 },
      relations: ['userCompanies'],
    });
  }

  async getCompanyMembers(companyId: number): Promise<UserCompany[]> {
    return await this.userCompanyRepository.find({
      where: { company: { id: companyId }, audit_status: 1 },
      relations: ['user'],
    });
  }

  async getUserCompanyStatus(userId: number, companyId: number): Promise<UserCompany | null> {
    return await this.userCompanyRepository.findOne({
      where: { user: { id: userId }, company: { id: companyId } },
    });
  }
}
