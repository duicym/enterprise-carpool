import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Route } from './route.entity';
import { Company } from '../company/company.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteListQueryDto } from './dto/route-list-query.dto';
import { RedisService } from '../../config/redis.service';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private redisService: RedisService,
  ) {}

  async create(userId: number, dto: CreateRouteDto): Promise<Route> {
    const company = dto.company_id
      ? await this.companyRepository.findOne({ where: { id: dto.company_id } })
      : null;

    const route = this.routeRepository.create({
      driver: { id: userId },
      company: company || undefined,
      company_id: dto.company_id,
      start_address: dto.start_address,
      start_latitude: dto.start_latitude,
      start_longitude: dto.start_longitude,
      end_address: dto.end_address,
      end_latitude: dto.end_latitude,
      end_longitude: dto.end_longitude,
      departure_time: dto.departure_time,
      seat_count: dto.seat_count,
      available_seats: dto.seat_count,
      price_per_seat: dto.price_per_seat,
      frequency: dto.frequency,
      publish_date: new Date(dto.publish_date),
      status: 1,
    });

    return await this.routeRepository.save(route);
  }

  async update(userId: number, routeId: number, dto: UpdateRouteDto): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id: routeId, driver: { id: userId } },
    });

    if (!route) {
      throw new HttpException(
        { code: 4001, message: '路线不存在或无权操作' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (route.available_seats !== route.seat_count) {
      throw new HttpException(
        { code: 4004, message: '已有乘客预约，不能修改路线' },
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(route, dto);
    return await this.routeRepository.save(route);
  }

  async delete(userId: number, routeId: number): Promise<void> {
    const route = await this.routeRepository.findOne({
      where: { id: routeId, driver: { id: userId } },
    });

    if (!route) {
      throw new HttpException(
        { code: 4001, message: '路线不存在或无权操作' },
        HttpStatus.NOT_FOUND,
      );
    }

    route.status = 2;
    await this.routeRepository.save(route);
  }

  async getList(query: RouteListQueryDto): Promise<any> {
    const {
      start_address,
      end_address,
      publish_date,
      page = 1,
      pageSize = 20,
    } = query;

    const where: any = {
      status: 1,
      available_seats: MoreThan(0),
    };

    if (publish_date) {
      where.publish_date = publish_date;
    }

    const [items, total] = await this.routeRepository.findAndCount({
      where,
      relations: ['driver', 'company'],
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

  async getDetail(id: number): Promise<Route | null> {
    return await this.routeRepository.findOne({
      where: { id, status: 1 },
      relations: ['driver', 'company'],
    });
  }

  async getMyRoutes(userId: number, status?: number): Promise<Route[]> {
    const where: any = { driver: { id: userId } };
    if (status) {
      where.status = status;
    }

    return await this.routeRepository.find({
      where,
      relations: ['company'],
      order: { created_at: 'DESC' },
    });
  }

  async decrementAvailableSeats(routeId: number, seats: number): Promise<boolean> {
    const lockKey = `route:lock:${routeId}`;
    
    const acquired = await this.redisService.acquireLock(lockKey, 5000);
    if (!acquired) {
      throw new HttpException(
        { code: 4002, message: '系统繁忙，请稍后重试' },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    try {
      const route = await this.routeRepository.findOne({ where: { id: routeId } });
      if (!route || route.available_seats < seats) {
        return false;
      }

      route.available_seats -= seats;
      if (route.available_seats === 0) {
        route.status = 3;
      }
      await this.routeRepository.save(route);
      return true;
    } finally {
      await this.redisService.releaseLock(lockKey);
    }
  }

  async incrementAvailableSeats(routeId: number, seats: number): Promise<void> {
    const route = await this.routeRepository.findOne({ where: { id: routeId } });
    if (route) {
      route.available_seats += seats;
      if (route.status === 3) {
        route.status = 1;
      }
      await this.routeRepository.save(route);
    }
  }
}
