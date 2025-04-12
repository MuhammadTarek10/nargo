import { Test, TestingModule } from '@nestjs/testing';
import { ProductDto, UpdateProductDto } from 'src/product/dto';
import { ProductController } from 'src/product/product.controller';
import { ProductService } from 'src/product/product.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    it('should call productService.create with correct user_id and dto', async () => {
      const userId = 'someUserId';
      const dto: ProductDto = {
        category: 'electronics',
        name: 'Smart TV',
        description: 'High-quality TV',
        price: 999.99,
        quantity: 10,
      };

      // Mock resolved value
      (productService.create as jest.Mock).mockResolvedValue('created-product');

      const result = await productController.create(userId, dto);

      expect(productService.create).toHaveBeenCalledWith(userId, dto);
      expect(result).toBe('created-product');
    });
  });

  describe('update', () => {
    it('should call productService.update with correct parameters', async () => {
      const productId = 'someProductId';
      const dto: UpdateProductDto = {
        name: 'Updated TV',
        price: 899.99,
      };

      // Mock resolved value
      (productService.update as jest.Mock).mockResolvedValue('updated-product');

      const result = await productController.update(productId, dto);

      expect(productService.update).toHaveBeenCalledWith(productId, dto);
      expect(result).toBe('updated-product');
    });
  });

  describe('delete', () => {
    it('should call productService.delete with correct id', async () => {
      const productId = 'someProductId';

      // Mock resolved value
      (productService.delete as jest.Mock).mockResolvedValue('deleted-product');

      const result = await productController.delete(productId);

      expect(productService.delete).toHaveBeenCalledWith(productId);
      expect(result).toBe('deleted-product');
    });
  });

  describe('findAll', () => {
    it('should call productService.findAll with correct query params', async () => {
      const category = 'electronics';
      const fromPrice = 100;
      const toPrice = 1000;
      const available = 'true';

      // Mock resolved value
      (productService.findAll as jest.Mock).mockResolvedValue([
        'product-1',
        'product-2',
      ]);

      const result = await productController.findAll(
        category,
        fromPrice,
        toPrice,
        available,
      );

      expect(productService.findAll).toHaveBeenCalledWith(
        category,
        fromPrice,
        toPrice,
        available,
      );
      expect(result).toEqual(['product-1', 'product-2']);
    });
  });

  describe('findOne', () => {
    it('should call productService.findOne with correct id', async () => {
      const productId = 'someProductId';

      // Mock resolved value
      (productService.findOne as jest.Mock).mockResolvedValue('single-product');

      const result = await productController.findOne(productId);

      expect(productService.findOne).toHaveBeenCalledWith(productId);
      expect(result).toBe('single-product');
    });
  });
});
