import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './order.entity';
import { RouteService } from '../route/route.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { OrderListQueryDto } from './dto/order-list-query.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private routeService: RouteService,
    private dataSource: DataSource,
  ) {}

  async create(passengerId: number, dto: CreateOrderDto): Promise<Order> {
    const route = await this.routeService.getDetail(dto.route_id);
    if (!route) {
      throw new HttpException(
        { code: 4001, message: '路线不存在' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (route.available_seats < dto.seats_booked) {
      throw new HttpException(
        { code: 4002, message: '座位不足' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const orderNo = this.generateOrderNo();

    const order = this.orderRepository.create({
      order_no: orderNo,
      route: { id: dto.route_id },
      driver: { id: route.driver_id },
      passenger: { id: passengerId },
      company: route.company,
      company_id: route.company_id,
      pickup_address: dto.pickup_address,
      dropoff_address: dto.dropoff_address,
      seats_booked: dto.seats_booked,
      total_amount: route.price_per_seat 
        ? Number(route.price_per_seat) * dto.seats_booked 
        : 0,
      status: 0,
    });

    return await this.orderRepository.save(order);
  }

  async confirm(driverId: number, orderId: number, dto: ConfirmOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, driver: { id: driverId } },
      relations: ['route'],
    });

    if (!order) {
      throw new HttpException(
        { code: 5001, message: '订单不存在或无权操作' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (order.status !== 0) {
      throw new HttpException(
        { code: 5002, message: '订单状态异常' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const success = await this.routeService.decrementAvailableSeats(
      order.route.id,
      order.seats_booked,
    );

    if (!success) {
      throw new HttpException(
        { code: 4002, message: '座位已被预约' },
        HttpStatus.BAD_REQUEST,
      );
    }

    order.status = 1;
    order.confirmed_at = new Date();
    return await this.orderRepository.save(order);
  }

  async cancel(userId: number, orderId: number, dto: CancelOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['route'],
    });

    if (!order) {
      throw new HttpException(
        { code: 5001, message: '订单不存在' },
        HttpStatus.NOT_FOUND,
      );
    }

    const isPassenger = order.passenger_id === userId;
    const isDriver = order.driver_id === userId;

    if (!isPassenger && !isDriver) {
      throw new HttpException(
        { code: 5002, message: '无权操作此订单' },
        HttpStatus.FORBIDDEN,
      );
    }

    if (order.status === 2 || order.status === 3) {
      throw new HttpException(
        { code: 5003, message: '订单已取消或已完成' },
        HttpStatus.BAD_REQUEST,
      );
    }

    order.status = 3;
    order.cancelled_at = new Date();

    if (isPassenger) {
      if (dto.reason) {
        order.passenger_cancel_reason = dto.reason;
      }
    } else {
      if (dto.reason) {
        order.driver_cancel_reason = dto.reason;
      }
    }

    if (order.status === 1) {
      await this.routeService.incrementAvailableSeats(order.route.id, order.seats_booked);
    }

    return await this.orderRepository.save(order);
  }

  async complete(userId: number, orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, driver: { id: userId } },
    });

    if (!order) {
      throw new HttpException(
        { code: 5001, message: '订单不存在或无权操作' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (order.status !== 1) {
      throw new HttpException(
        { code: 5002, message: '订单状态异常，无法完成' },
        HttpStatus.BAD_REQUEST,
      );
    }

    order.status = 2;
    order.completed_at = new Date();
    return await this.orderRepository.save(order);
  }

  async getList(userId: number, query: OrderListQueryDto): Promise<any> {
    const { status, page = 1, pageSize = 20 } = query;

    const where: any = [];

    where.push({ driver: { id: userId } });
    where.push({ passenger: { id: userId } });

    const andConditions: any = { status: status !== undefined ? status : 0 };
    where.forEach(w => {
      Object.assign(w, andConditions);
    });

    const [items, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['route', 'driver', 'passenger', 'company'],
      order: { booked_at: 'DESC' },
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

  async getDetail(userId: number, orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: [{ id: orderId, driver: { id: userId } }, { id: orderId, passenger: { id: userId } }],
      relations: ['route', 'driver', 'passenger', 'company'],
    });

    if (!order) {
      throw new HttpException(
        { code: 5001, message: '订单不存在' },
        HttpStatus.NOT_FOUND,
      );
    }

    return order;
  }

  async getMyOrders(userId: number, type?: string): Promise<Order[]> {
    const where: any[] = [];

    if (!type || type === 'driver') {
      where.push({ driver: { id: userId } });
    }
    if (!type || type === 'passenger') {
      where.push({ passenger: { id: userId } });
    }

    return await this.orderRepository.find({
      where,
      relations: ['route', 'driver', 'passenger', 'company'],
      order: { booked_at: 'DESC' },
    });
  }

  private generateOrderNo(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CP${timestamp}${random}`.toUpperCase();
  }
}
