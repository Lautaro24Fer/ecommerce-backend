import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPaymentPreferenceResponse, PaymentPreferenceRequestDto } from './dto/preference-payment';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Creation of the payment preference'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment preference created succesfull'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error creating payment preference'
  })
  @Post('/preference')
  async createPaymentPreference(@Body() paymentPreference: PaymentPreferenceRequestDto ){
    
    const paymentPreferenceCreated: IPaymentPreferenceResponse = await this.paymentService.createPaymentPreference(paymentPreference);
    return paymentPreferenceCreated;
  }
}
