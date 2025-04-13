import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto';

@UseInterceptors(CacheInterceptor)
@UseGuards(JwtGuard)
@Controller('carts')
export class CartController {
  constructor(private service: CartService) {}

  @Get()
  async getCart(@GetUser('id') user_id: string) {
    return await this.service.get(user_id);
  }

  @Post('products')
  async addToCart(@GetUser('id') user_id: string, @Body() dto: AddToCartDto) {
    return await this.service.add(user_id, dto);
  }

  @Patch('products/:id')
  async removeFromCart(
    @GetUser('id') user_id: string,
    @Param('id') product_id: string,
  ) {
    return await this.service.remove(user_id, product_id);
  }
}
