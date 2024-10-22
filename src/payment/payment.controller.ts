import { Controller, Get, Post, Body, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PaymentGuard } from './payment.guard';
import { IPaymentPreferenceReq } from './dto/preference-payment';

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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation. Need tokens for make a payment preference'
  })
  @UseGuards(PaymentGuard)
  @Post('/preference')
  async createPaymentPreference(@Body() paymentPreference: IPaymentPreferenceReq,  @Req() req: Request, @Res() res: Response ){
    
    
  }

}
