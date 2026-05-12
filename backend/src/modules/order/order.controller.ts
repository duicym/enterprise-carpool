import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { OrderListQueryDto } from './dto/order-list-query.dto';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async create(@Req() request: any, @Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(request.user.userId, createOrderDto);
    return {
      code: 0,
      message: '预约成功，等待车主确认',
      data: order,
    };
  }

  @Put(':id/confirm')
  async confirm(
    @Req() request: any,
    @Param('id') id: number,
    @Body() confirmOrderDto: ConfirmOrderDto,
  ) {
    const order = await this.orderService.confirm(request.user.userId, id, confirmOrderDto);
    return {
      code: 0,
      message: '已确认订单',
      data: order,
    };
  }

  @Put(':id/cancel')
  async cancel(
    @Req() request: any,
    @Param('id') id: number,
    @Body() cancelOrderDto: CancelOrderDto,
  ) {
    const order = await this.orderService.cancel(request.user.userId, id, cancelOrderDto);
    return {
      code: 0,
      message: '已取消订单',
      data: order,
    };
  }

  @Put(':id/complete')
  async complete(@Req() request: any, @Param('id') id: number) {
    const order = await this.orderService.complete(request.user.userId, id);
    return {
      code: 0,
      message: '订单已完成',
      data: order,
    };
  }

  @Get('list')
  async getList(@Req() request: any, @Query() query: OrderListQueryDto) {
    const result = await this.orderService.getList(request.user.userId, query);
    return {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  @Get(':id')
  async getDetail(@Req() request: any, @Param('id') id: number) {
    const order = await this.orderService.getDetail(request.user.userId, id);
    return {
      code: 0,
      message: 'success',
      data: order,
    };
  }

  @Get('my')
  async getMyOrders(@Req() request: any, @Query('type') type?: string) {
    const orders = await this.orderService.getMyOrders(request.user.userId, type);
    return {
      code: 0,
      message: 'success',
      data: orders,
    };
  }
}
