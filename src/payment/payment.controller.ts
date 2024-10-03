import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IPaymentPreferenceRequest } from './dto/preference-payment';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Creation of the intent payment'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Intent payment created succesfull'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error creating intent payment'
  })
  @Post('/payment')
  async createPaymentPreference(@Body() paymentPreference: IPaymentPreferenceRequest){
    
  }
}
