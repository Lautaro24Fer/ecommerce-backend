import { Controller, Get, Post, Body, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
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
  // TODO: La id no debería llegar desde el body, sino desde la cookie ya que es un recurso protegido
  @Post('mp/preference')
  async createPaymentPreference(@Body() paymentPreference: IPaymentPreferenceReq,  @Res() res: Response ): Promise<void>{
    await this.paymentService.createPaymentPreference(paymentPreference, res);
  }


  @Get("mp/preference/success")
  async successRedirect() {
    return { status: "El pago se hizo correctamente :D" }
  }

  @Get("mp/preference/failure")
  async failureRedirect() {
    return { status: "Error volviendo al sitio :(" }
  }

  @Get("mp/preference/pending")
  async pendingRedirect() {
    return { status: "EL pag esta pendiente :/" }
  }

  @Post("mp/preference/webhook")
  async notificationWehbook(){
    
  }
}
