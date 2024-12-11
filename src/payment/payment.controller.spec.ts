import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { EmailService } from '../email/email.service';
import { OrderService } from '../order/order.service';
import { Response } from 'express';
import { IPaymentPreferenceReq } from './dto/preference-payment';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PaymentService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some_value'),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn().mockResolvedValue({ recourse: { address: [] } }),
          },
        },
        {
          provide: ProductService,
          useValue: {
            validateOperation: jest.fn().mockResolvedValue({ status: true }),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: OrderService,
          useValue: {
            updateOrderStatus: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    paymentController = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe('createPaymentPreference', () => {

    const res: Response = {} as unknown as Response;

    it('should create a payment preference successfully', async () => {
      const mockPreferenceData = { /* mock data */ } as unknown as IPaymentPreferenceReq;
      jest.spyOn(paymentService, 'generatePaymentOrException').mockResolvedValue(undefined);

      await expect(paymentController.createPaymentPreference(mockPreferenceData, res)).resolves.toBeUndefined();
    });

    it('should throw BAD_REQUEST when there is an error in the payment preference data', async () => {
      const mockPreferenceData = { /* invalid mock data */ } as unknown as IPaymentPreferenceReq;
      jest.spyOn(paymentService, 'generatePaymentOrException').mockImplementation(() => {
        throw new BadRequestException();
      });

      await expect(paymentController.createPaymentPreference(mockPreferenceData, res)).rejects.toThrow(BadRequestException);
    });

    it('should throw UNAUTHORIZED when tokens are not provided', async () => {
      const mockPreferenceData = { /* mock data without tokens */ } as unknown as IPaymentPreferenceReq;
      jest.spyOn(paymentService, 'generatePaymentOrException').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      await expect(paymentController.createPaymentPreference(mockPreferenceData, res)).rejects.toThrow(UnauthorizedException);
    });
  });
});