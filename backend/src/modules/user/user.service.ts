import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userCompanies', 'userCompanies.company'],
    });
  }

  async updateProfile(userId: number, dto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(userId, dto);
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async getUserCompanies(userId: number): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userCompanies', 'userCompanies.company'],
    });

    return user?.userCompanies || [];
  }
}
