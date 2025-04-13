import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { DbModule } from './db/db.module';
import { EmailModule } from './email/email.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AllExceptionsFilter } from './utils/filters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        ttl: 10000,
        stores: [
          createKeyv({
            url: process.env.REDIS_URL,
          }),
        ],
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 2,
      },
    ]),
    AuthModule,
    DbModule,
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
