import { Controller, Get, Post, Body, HttpStatus, Req, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentGuard } from './payment.guard';
import { IPaymentPreferenceReq } from './dto/preference-payment';
import { IBadRequestex } from 'src/global/responseInterfaces';
import { IsPositive } from 'class-validator';

class PaymentStatusDto{
  @ApiProperty()
  @IsPositive()
  paymentId: number;
}

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
    await this.paymentService.generatePaymentOrException(paymentPreference, res);
  }

  // TODO: Hay que decirle a nacho que debe configurar la ruta para webhooks
  // desde la integración
  // @Post("mp/preference/webhook")
  // async notificationWehbook(@Body() payload: any) {
  //     const paymentId = payload?.data?.id;
  //     if (!paymentId) {
  //       const badRequestError: IBadRequestex = {
  //         status: false,
  //         message: "Payment ID not found"
  //       }
  //       throw new BadRequestException(badRequestError);
  //     }
  //     // Procesar el pago y actualizar el estado de la orden
  //     await this.paymentService.updateOrderStatusByPaymentId(paymentId);
      
  //     return { status: 'success' };
  // }

  // // Testeo para conocer el estado del payment
  // @Post("mp/preference/status")
  // async knowStatus(@Body() paymentStatusDto: PaymentStatusDto){

  //   await this.paymentService.knowStatus(paymentStatusDto.paymentId);
  // }
}


