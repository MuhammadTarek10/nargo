import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AdminGuard } from 'src/auth/guard';
import { ProductDto, UpdateProductDto } from './dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private service: ProductService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@GetUser('id') user_id: string, @Body() dto: ProductDto) {
    return await this.service.create(user_id, dto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return await this.service.update(id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }

  // TODO: add caching
  @Get()
  async findAll(
    @Query('category') category: string,
    @Query('from-price') from_price: number,
    @Query('to-price') to_price: number,
    @Query('available') available: string,
  ) {
    return await this.service.findAll(
      category,
      from_price,
      to_price,
      available,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }
}
