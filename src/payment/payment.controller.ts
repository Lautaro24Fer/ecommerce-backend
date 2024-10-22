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
  // @UseGuards(PaymentGuard)
  @Post('mp/preference')
  async createPaymentPreference(@Body() paymentPreference: IPaymentPreferenceReq,  @Req() req: Request, @Res() res: Response ){
    console.log(" ===== CONTROLADOR ===== ")
    console.log(paymentPreference)
    const response = await this.paymentService.createPaymentPreference(paymentPreference);
    console.log("CONTROLLER)) Response")
    console.log(response)
  }


  @Post("mp/preference/success")
  async successRedirect() {

  }

  @Post("mp/preference/failure")
  async failureRedirect() {
    
  }

  @Post("mp/preference/pending")
  async pendingRedirect() {
    
  }

  @Post("mp/preference/webhook")
  async notificationWehbook(){

  }
}
