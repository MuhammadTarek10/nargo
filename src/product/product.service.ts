import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, product } from 'generated/prisma';
import { DbService } from 'src/db/db.service';
import { category } from './../../generated/prisma/index.d';
import { ProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private db: DbService) {}

  async create(
    user_id: string,
    dto: ProductDto,
  ): Promise<Partial<product> | undefined> {
    const category = await this.db.category.findUnique({
      where: {
        slug: dto.category,
      },
    });

    if (!category) {
      await this.db.$transaction(async (tx) => {
        const category = await this.createCategory(tx, dto);
        return await this.createProduct(tx, dto, user_id, category.slug!);
      });
    } else {
      return await this.createProduct(this.db, dto, user_id, category.slug);
    }
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<Partial<product> | undefined> {
    const product = await this.db.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return await this.db.product.update({
      where: { id: id },
      data: {
        name: dto.name ?? product.name,
        description: dto.description ?? product.description,
        price: dto.price ?? product.price,
        quantity: dto.quantity ?? product.quantity,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const product = await this.db.product.findUnique({
      where: { id: id },
    });

    if (!product) throw new NotFoundException('Product not found');

    await this.db.product.delete({
      where: { id: id },
    });
  }

  async findAll(
    category: string,
    form_price: number,
    to_price: number,
    available: string,
  ): Promise<Partial<product>[]> {
    const where: Prisma.productWhereInput = {};

    if (category) {
      where.category_slug = category;
    }

    if (form_price) {
      where.price = {
        gte: form_price,
      };
    }

    if (to_price) {
      where.price = {
        lte: to_price,
      };
    }

    if (available) {
      where.quantity = {
        gt: 0,
      };
    }

    return this.db.product.findMany({ where });
  }

  async findOne(id: string): Promise<Partial<product> | undefined> {
    const product = await this.db.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  private async createProduct(
    tx: Prisma.TransactionClient,
    dto: ProductDto,
    user_id: string,
    category_slug: string,
  ): Promise<Partial<product>> {
    return await tx.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        category_slug: category_slug,
        created_by: user_id,
      },
    });
  }

  private async createCategory(
    tx: Prisma.TransactionClient,
    dto: ProductDto,
  ): Promise<Partial<category>> {
    return await tx.category.create({
      data: {
        slug: dto.category,
        name: dto.category,
      },
    });
  }
}
