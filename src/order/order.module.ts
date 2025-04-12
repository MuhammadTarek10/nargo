import { Module } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  providers: [OrderService, CartService],
  controllers: [OrderController],
})
export class OrderModule {}
