import { Controller, Get, Post, Body, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IOrderStatus, IPaymentPreferenceResponse, ITokenReq, PaymentPreferenceRequestDto } from './dto/preference-payment';
import { Request, Response } from 'express';
import { PaymentGuard } from './payment.guard';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Get the tokens for made the operations with openpay'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The token was created succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The token was not created'
  })
  @Get('/token')
  async getTokens(@Req() req: Request, @Res() res: Response){
    
    const token: string = await this.paymentService.getTokensFromAPI();
    res.cookie('openpay_token', token, {
      maxAge: 1000 * 60 * 10, 
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
    return res.status(201).json({ status: true, message: "The token was created ans saved succesfully" })
  }

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
  async createPaymentPreference(@Body() paymentPreference: PaymentPreferenceRequestDto, @Req() req: Request, @Res() res: Response ){
    console.log("______ ESTE ES EL CONTROLSDOR ________")
    const token = req.cookies['openpay_token'];
    const paymentPreferenceCreated: IPaymentPreferenceResponse = await this.paymentService.createPaymentPreference(paymentPreference, token); 
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
