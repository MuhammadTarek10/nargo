import { Module } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { EmailService } from 'src/email/email.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  providers: [OrderService, CartService, EmailService],
  controllers: [OrderController],
})
export class OrderModule {}
