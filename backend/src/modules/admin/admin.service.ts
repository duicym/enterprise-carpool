import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCompany } from '../company/user-company.entity';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserCompany)
    private userCompanyRepository: Repository<UserCompany>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async getCertificates(query: any) {
    const { status = 0, page = 1, pageSize = 20 } = query;
    const [items, total] = await this.userCompanyRepository.findAndCount({
      where: { audit_status: status },
      relations: ['user', 'company'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async auditCertificate(id: number, auditStatus: number, remark?: string): Promise<UserCompany> {
    const userCompany = await this.userCompanyRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!userCompany) {
      throw new HttpException(
        { code: 1004, message: '审核记录不存在' },
        HttpStatus.NOT_FOUND,
      );
    }

    userCompany.audit_status = auditStatus;
    if (remark) {
      userCompany.audit_remark = remark;
    }
    userCompany.audited_at = new Date();

    return await this.userCompanyRepository.save(userCompany);
  }

  async getUsers(page: number = 1, pageSize: number = 20) {
    const [items, total] = await this.userRepository.findAndCount({
      relations: ['userCompanies', 'userCompanies.company'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async updateUserStatus(userId: number, status: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException(
        { code: 1004, message: '用户不存在' },
        HttpStatus.NOT_FOUND,
      );
    }

    user.gender = status;
    return await this.userRepository.save(user);
  }
}
