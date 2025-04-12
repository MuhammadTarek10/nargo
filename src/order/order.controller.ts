import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AdminGuard, JwtGuard } from 'src/auth/guard';
import { Constants } from 'src/constants';
import { OrderService } from './order.service';

@UseGuards(JwtGuard)
@Controller('orders')
export class OrderController {
  constructor(private service: OrderService) {}

  @Get()
  async getStatus(
    @GetUser('id') user_id: string,
    @Query('status') status: string,
  ) {
    switch (status?.toLowerCase()) {
      case Constants.pending:
        return await this.service.getPending(user_id);
      case Constants.delivered:
        return await this.service.getHistory(user_id);
      default:
        return await this.service.get(user_id);
    }
  }

  @Post()
  async create(@GetUser('id') user_id: string) {
    return await this.service.create(user_id);
  }

  @UseGuards(AdminGuard)
  @Get('all')
  async getAll() {
    return await this.service.findAll();
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') order_id: string, @Body('status') status: string) {
    return await this.service.update(order_id, status);
  }
}
