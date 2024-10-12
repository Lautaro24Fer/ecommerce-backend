import { Controller, Get, Post, Body, HttpStatus, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IOrderStatus, IPaymentPreferenceResponse, PaymentPreferenceRequestDto } from './dto/preference-payment';
import { Request, Response } from 'express';

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
  async createPaymentPreference(@Body() paymentPreference: PaymentPreferenceRequestDto, @Req() req: Request, @Res() res: Response ){
    console.log("______ ESTE ES EL CONTROLSDOR ________")
    const paymentPreferenceCreated: IPaymentPreferenceResponse = await this.paymentService.createPaymentPreference(paymentPreference); 
    console.log("payment preference created")
    console.log(JSON.stringify(paymentPreferenceCreated, null , 2));
    const location: string = paymentPreferenceCreated.data.id;
    const orderStatus: IOrderStatus = await this.paymentService.getOrderStatus(location);

    try{
      console.log("Link del checkout")
      console.log(orderStatus.data.links[0].checkout)
      // No se testea en swagger, requiere cliente
      return res.status(201).json({ url: orderStatus.data.links[0].checkout })
    }
    catch(error){ 
      console.error(error)
      return res.status(400).json({ message: error })
    }
    
  }

  @ApiOperation({
    summary: "Redirection URL in succces situation"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The payment was carged succesfully"
  })
  @Get("/success")
  async successPayment() {
    return { message: "The payment was maded succesfully!!!!" }
  }

  @ApiOperation({
    summary: "Redirection URL in fail situation"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The payment was not carged succesfully"
  })
  @Get("/success")
  async failedPayment() {
    return { error: "The payment was not maded :(" }
  }
}
