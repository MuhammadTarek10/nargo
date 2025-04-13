import { Injectable, NotFoundException } from '@nestjs/common';
import { order, Prisma } from 'generated/prisma';
import { CartService } from 'src/cart/cart.service';
import { Constants } from 'src/constants';
import { DbService } from 'src/db/db.service';
import { EmailService } from 'src/email/email.service';
import { getStatus } from 'src/utils/order-status';

@Injectable()
export class OrderService {
  constructor(
    private db: DbService,
    private cartService: CartService,
    private emailService: EmailService,
  ) {}

  async findAll(): Promise<Partial<order[]>> {
    return this.db.order.findMany();
  }

  async getHistory(user_id: string): Promise<Partial<order[]>> {
    return this.getOrders(user_id, Constants.delivered);
  }

  async getPending(user_id: string): Promise<Partial<order[]>> {
    return this.getOrders(user_id, Constants.pending);
  }

  async get(user_id: string): Promise<Partial<order[]>> {
    return this.db.order.findMany({
      where: { user_id: user_id },
    });
  }

  private async getOrders(
    user_id: string,
    status: string,
  ): Promise<Partial<order[]>> {
    return this.db.order.findMany({
      where: { user_id: user_id, status: getStatus(status) },
      include: {
        items: {
          select: {
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async create(user_id: string): Promise<void> {
    return this.db.$transaction(async (tx) => {
      return await this.createOrder(tx, user_id);
    });
  }

  async update(
    order_id: string,
    status: string = Constants.shipped,
  ): Promise<Partial<order>> {
    const order = await this.db.order.findUnique({
      where: { id: order_id },
    });

    if (!order) throw new NotFoundException('Order not found');

    const updatedOrder = await this.db.order.update({
      where: { id: order_id },
      data: {
        status: getStatus(status),
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    await this.emailService.notify(updatedOrder.user.email, order_id, status);

    return updatedOrder;
  }

  private async createOrder(
    tx: Prisma.TransactionClient,
    user_id: string,
  ): Promise<void> {
    const cart = await tx.cart.findUnique({
      where: { user_id: user_id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) throw new Error('Cart not found');

    if (cart?.items.length === 0) throw new Error('Cart is empty');

    const total = cart.items.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await tx.order.create({
      data: {
        user_id: user_id,
        total: total,
      },
    });

    await tx.order_item.createMany({
      data: cart.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    });

    await Promise.all(
      cart.items.map(async (item) => {
        await tx.product.update({
          where: { id: item.product_id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }),
    );

    await this.cartService.clear(tx, user_id);
  }
}
