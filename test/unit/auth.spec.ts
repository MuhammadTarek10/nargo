import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto, RegisterDto } from 'src/auth/dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call AuthService.register with the correct parameters and return its result', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        first_name: 'John',
        last_name: 'Doe',
        role: 'Customer',
      };

      const expectedResult = { access_token: 'some-token' };
      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      const result = await authController.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with the correct parameters and return its result', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const expectedResult = { access_token: 'some-token' };
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await authController.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
