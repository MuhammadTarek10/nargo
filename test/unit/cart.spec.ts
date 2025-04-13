import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from 'src/cart/cart.controller';
import { CartService } from 'src/cart/cart.service';
import { AddToCartDto } from 'src/cart/dto';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            get: jest.fn(),
            add: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  describe('getCart', () => {
    it('should call service.get with the correct user_id', async () => {
      const user_id = 'user123';
      (service.get as jest.Mock).mockResolvedValueOnce('user-cart');

      const result = await controller.getCart(user_id);

      expect(service.get).toHaveBeenCalledWith(user_id);
      expect(result).toBe('user-cart');
    });
  });

  describe('addToCart', () => {
    it('should call service.add with the correct user_id and dto', async () => {
      const user_id = 'user123';
      const dto: AddToCartDto = {
        product_id: 'prod456',
        quantity: 2,
      };
      (service.add as jest.Mock).mockResolvedValueOnce('added-item');

      const result = await controller.addToCart(user_id, dto);

      expect(service.add).toHaveBeenCalledWith(user_id, dto);
      expect(result).toBe('added-item');
    });
  });

  describe('removeFromCart', () => {
    it('should call service.remove with the correct user_id and product_id', async () => {
      const user_id = 'user123';
      const product_id = 'prod456';
      (service.remove as jest.Mock).mockResolvedValueOnce('removed-item');

      const result = await controller.removeFromCart(user_id, product_id);

      expect(service.remove).toHaveBeenCalledWith(user_id, product_id);
      expect(result).toBe('removed-item');
    });
  });
});
