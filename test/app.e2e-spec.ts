import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AuthModule } from 'src/auth/auth.module';
import { LoginDto, RegisterDto } from 'src/auth/dto';
import { CartModule } from 'src/cart/cart.module';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';
import { EmailModule } from 'src/email/email.module';
import { OrderModule } from 'src/order/order.module';
import { ProductDto } from 'src/product/dto';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';

describe('App e2e', () => {
  let app: INestApplication;
  let db: DbService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
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
        AuthModule,
        DbModule,
        UserModule,
        ProductModule,
        CartModule,
        OrderModule,
        EmailModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    db = app.get(DbService);
    await db.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const user: RegisterDto = {
      email: 'test@test.com',
      password: 'password',
      first_name: 'Test',
      last_name: 'Test',
      role: 'Customer',
    };

    const admin: RegisterDto = {
      email: 'admin@test.com',
      password: 'password',
      first_name: 'Admin',
      last_name: 'Admin',
      role: 'Admin',
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: user.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: user.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/register').expectStatus(400);
      });

      it('should register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(user)
          .expectStatus(201);
      });

      it('should throw if email is already in use', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(user)
          .expectStatus(400);
      });

      it('should register admin', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(admin)
          .expectStatus(201);
      });

      it('should throw if admin email is already in use', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(admin)
          .expectStatus(400);
      });
    });

    describe('Login', () => {
      const user: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };

      const admin: LoginDto = {
        email: 'admin@test.com',
        password: 'password',
      };

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: user.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });

      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(user)
          .expectStatus(200)
          .stores('user_access_token', 'access_token');
      });

      it('should login admin', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(admin)
          .expectStatus(200)
          .stores('admin_access_token', 'access_token');
      });
    });
  });

  describe('User', () => {
    const user: RegisterDto = {
      email: 'test@test.com',
      password: 'password',
      first_name: 'Test',
      last_name: 'Test',
      role: 'Customer',
    };

    const admin: RegisterDto = {
      email: 'admin@test.com',
      password: 'password',
      first_name: 'Admin',
      last_name: 'Admin',
      role: 'Admin',
    };

    it('should get current user', () => {
      return pactum
        .spec()
        .get('/user/me')
        .withBearerToken('$S{user_access_token}')
        .expectStatus(200)
        .expectBodyContains(user.email)
        .expectBodyContains(user.first_name)
        .expectBodyContains(user.last_name)
        .expectBodyContains(user.role);
    });

    it('should get current admin', () => {
      return pactum
        .spec()
        .get('/user/me')
        .withBearerToken('$S{admin_access_token}')
        .expectStatus(200)
        .expectBodyContains(admin.email)
        .expectBodyContains(admin.first_name)
        .expectBodyContains(admin.last_name)
        .expectBodyContains(admin.role);
    });

    it('should update user', () => {
      return pactum
        .spec()
        .patch('/user')
        .withBearerToken('$S{user_access_token}')
        .withBody({
          email: 'test2@test.com',
          first_name: 'Test2',
          last_name: 'Test2',
        })
        .expectStatus(200)
        .expectBodyContains('test2@test.com')
        .expectBodyContains('Test2')
        .expectBodyContains('Test2');
    });

    it('should update admin', () => {
      return pactum
        .spec()
        .patch('/user')
        .withBearerToken('$S{admin_access_token}')
        .withBody({
          first_name: 'Admin2',
        })
        .expectStatus(200)
        .expectBodyContains('Admin2');
    });
  });

  describe('Product', () => {
    const dto: ProductDto = {
      name: 'Phone',
      description: 'Its a phone',
      price: 100,
      quantity: 100,
      category: 'tech',
    };

    it('should get empty product list', () => {
      return pactum
        .spec()
        .get('/products')
        .expectStatus(200)
        .expectJsonLength(0);
    });

    it('should throw if not admin', () => {
      return pactum
        .spec()
        .post('/products')
        .withBearerToken('$S{user_access_token}')
        .withBody(dto)
        .expectStatus(401);
    });

    it('should create product', () => {
      return pactum
        .spec()
        .post('/products')
        .withBearerToken('$S{admin_access_token}')
        .withBody(dto)
        .expectStatus(201)
        .stores('product_id', 'id');
    });

    it('should get product list', () => {
      return pactum.spec().get('/products').expectStatus(200);
    });

    it('should get product by id', () => {
      return pactum
        .spec()
        .get('/products/{id}')
        .withPathParams('id', '$S{product_id}')
        .expectStatus(200)
        .expectBodyContains(dto.name)
        .expectBodyContains(dto.description)
        .expectBodyContains(dto.price.toString())
        .expectBodyContains(dto.quantity.toString());
    });

    it('should throw if not admin', () => {
      return pactum
        .spec()
        .delete('/products/{id}')
        .withPathParams('id', '$S{product_id}')
        .expectStatus(401);
    });

    it('should delete product', () => {
      return pactum
        .spec()
        .delete('/products/{id}')
        .withPathParams('id', '$S{product_id}')
        .withBearerToken('$S{admin_access_token}')
        .expectStatus(200);
    });

    it('should throw if product not found', () => {
      return pactum
        .spec()
        .delete('/products/{id}')
        .withPathParams('id', 'c538806e-9bb6-44a5-8c58-37609a7044f0')
        .expectStatus(404);
    });

    it('should throw if not admin', () => {
      return pactum
        .spec()
        .patch('/products/{id}')
        .withPathParams('id', '$S{product_id}')
        .withBearerToken('$S{user_access_token}')
        .expectStatus(401);
    });

    it('should update product', () => {
      return pactum
        .spec()
        .patch('/products/{id}')
        .withPathParams('id', '$S{product_id}')
        .withBearerToken('$S{admin_access_token}')
        .withBody({
          name: 'Phone2',
        })
        .expectStatus(200)
        .expectBodyContains('Phone2');
    });
  });
});
