import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { RouteService } from './route.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteListQueryDto } from './dto/route-list-query.dto';

@Controller('route')
@UseGuards(JwtAuthGuard)
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Post()
  async create(@Req() request: any, @Body() createRouteDto: CreateRouteDto) {
    const route = await this.routeService.create(request.user.userId, createRouteDto);
    return {
      code: 0,
      message: '发布成功',
      data: route,
    };
  }

  @Put(':id')
  async update(
    @Req() request: any,
    @Param('id') id: number,
    @Body() updateRouteDto: UpdateRouteDto,
  ) {
    const route = await this.routeService.update(request.user.userId, id, updateRouteDto);
    return {
      code: 0,
      message: '更新成功',
      data: route,
    };
  }

  @Delete(':id')
  async delete(@Req() request: any, @Param('id') id: number) {
    await this.routeService.delete(request.user.userId, id);
    return {
      code: 0,
      message: '删除成功',
      data: null,
    };
  }

  @Get('list')
  async getList(@Query() query: RouteListQueryDto) {
    const result = await this.routeService.getList(query);
    return {
      code: 0,
      message: 'success',
      data: result,
    };
  }

  @Get(':id')
  async getDetail(@Param('id') id: number) {
    const route = await this.routeService.getDetail(id);
    return {
      code: 0,
      message: 'success',
      data: route,
    };
  }

  @Get('my')
  async getMyRoutes(@Req() request: any, @Query('status') status?: number) {
    const routes = await this.routeService.getMyRoutes(request.user.userId, status);
    return {
      code: 0,
      message: 'success',
      data: routes,
    };
  }
}
