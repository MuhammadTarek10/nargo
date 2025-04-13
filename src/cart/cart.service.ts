import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { cart, Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';
import { cart_item } from './../../generated/prisma/index.d';
import { AddToCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private db: DbService) {}

  async get(user_id: string): Promise<Partial<cart>> {
    const cart = await this.db.cart.findUnique({
      where: { user_id: user_id },
      include: {
        items: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
                category_slug: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return await this.createCart(this.db, user_id);
    } else {
      return cart;
    }
  }

  async add(user_id: string, dto: AddToCartDto): Promise<void> {
    const product = await this.db.product.findUnique({
      where: { id: dto.product_id },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.quantity < dto.quantity)
      throw new BadRequestException('Product is out of stock');

    const cart = await this.db.cart.findUnique({
      where: { user_id: user_id },
    });

    if (!cart) {
      await this.db.$transaction(async (tx) => {
        const cart = await this.createCart(tx, user_id);
        await this.createCartItem(tx, cart.id!, dto.product_id, dto.quantity);
      });
    } else {
      await this.db.$transaction(async (tx) => {
        await this.createCartItem(tx, cart.id, dto.product_id, dto.quantity);
      });
    }
  }

  async remove(user_id: string, product_id: string): Promise<void> {
    const cart = await this.db.cart.findUnique({
      where: { user_id: user_id },
    });

    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.db.cart_item.findFirst({
      where: { cart_id: cart.id, product_id: product_id },
    });

    if (!item) throw new NotFoundException('Item not found');

    await this.db.$transaction(async (tx) => {
      await this.removeCartItem(tx, item.id, item.product_id, item.quantity);
    });
  }

  async clear(tx: Prisma.TransactionClient, user_id: string): Promise<void> {
    await tx.cart.delete({
      where: { user_id: user_id },
    });
  }

  private async createCart(
    tx: Prisma.TransactionClient,
    user_id: string,
  ): Promise<Partial<cart>> {
    return tx.cart.create({
      data: {
        user_id: user_id,
      },
    });
  }

  private async createCartItem(
    tx: Prisma.TransactionClient,
    cart_id: string,
    product_id: string,
    quantity: number,
  ): Promise<Partial<cart_item>> {
    const item = await tx.cart_item.findFirst({
      where: {
        cart_id: cart_id,
        product_id: product_id,
      },
    });

    if (item) {
      return await this.updateCartItem(tx, item.id, item.quantity + quantity);
    }

    return await tx.cart_item.create({
      data: {
        cart_id: cart_id,
        product_id: product_id,
        quantity: quantity,
      },
    });
  }

  private async updateCartItem(
    tx: Prisma.TransactionClient,
    item_id: string,
    quantity: number,
  ): Promise<Partial<cart_item>> {
    return await tx.cart_item.update({
      where: { id: item_id },
      data: {
        quantity: quantity,
      },
    });
  }

  private async removeCartItem(
    tx: Prisma.TransactionClient,
    item_id: string,
    product_id: string,
    quantity: number,
  ): Promise<Partial<cart_item>> {
    await tx.product.update({
      where: { id: product_id },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });

    return await tx.cart_item.delete({
      where: { id: item_id },
    });
  }
}
