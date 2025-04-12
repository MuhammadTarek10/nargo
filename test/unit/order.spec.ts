import { Test, TestingModule } from '@nestjs/testing';
import { Constants } from 'src/constants';
import { OrderController } from 'src/order/order.controller';
import { OrderService } from 'src/order/order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            getPending: jest.fn(),
            getHistory: jest.fn(),
            get: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  describe('getStatus', () => {
    it('should call service.getPending if status is "pending"', async () => {
      const userId = 'user123';
      const status = Constants.pending; // or 'pending'
      (service.getPending as jest.Mock).mockResolvedValueOnce('pending-orders');

      const result = await controller.getStatus(userId, status);

      expect(service.getPending).toHaveBeenCalledWith(userId);
      expect(result).toEqual('pending-orders');
    });

    it('should call service.getHistory if status is "delivered"', async () => {
      const userId = 'user123';
      const status = Constants.delivered; // or 'delivered'
      (service.getHistory as jest.Mock).mockResolvedValueOnce(
        'delivered-orders',
      );

      const result = await controller.getStatus(userId, status);

      expect(service.getHistory).toHaveBeenCalledWith(userId);
      expect(result).toEqual('delivered-orders');
    });

    it('should call service.get if status is something else', async () => {
      const userId = 'user123';
      const status = 'some-other-status';
      (service.get as jest.Mock).mockResolvedValueOnce('other-orders');

      const result = await controller.getStatus(userId, status);

      expect(service.get).toHaveBeenCalledWith(userId);
      expect(result).toEqual('other-orders');
    });

    it('should call service.get if no status is provided', async () => {
      const userId = 'user123';
      (service.get as jest.Mock).mockResolvedValueOnce('default-orders');

      const result = await controller.getStatus(userId);

      expect(service.get).toHaveBeenCalledWith(userId);
      expect(result).toEqual('default-orders');
    });
  });

  describe('create', () => {
    it('should call service.create with correct user id', async () => {
      const userId = 'user123';
      (service.create as jest.Mock).mockResolvedValueOnce('created-order');

      const result = await controller.create(userId);

      expect(service.create).toHaveBeenCalledWith(userId);
      expect(result).toEqual('created-order');
    });
  });

  describe('getAll', () => {
    it('should call service.findAll', async () => {
      (service.findAll as jest.Mock).mockResolvedValueOnce('all-orders');

      const result = await controller.getAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual('all-orders');
    });
  });

  describe('update', () => {
    it('should call service.update with correct order id and status', async () => {
      const orderId = 'order123';
      const status = 'SHIPPED';
      (service.update as jest.Mock).mockResolvedValueOnce('updated-order');

      const result = await controller.update(orderId, status);

      expect(service.update).toHaveBeenCalledWith(orderId, status);
      expect(result).toEqual('updated-order');
    });
  });
});
