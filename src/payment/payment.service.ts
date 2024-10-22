import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaymentPreferenceResponse, ITokenReq, PaymentPreferenceRequestDto } from './dto/preference-payment';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { response } from 'express';
import { json } from 'stream/consumers';
import { ModuleTokenFactory } from '@nestjs/core/injector/module-token-factory';
import axios from 'axios';
import MercadoPagoConfig from 'mercadopago';

@Injectable()
export class PaymentService {

	constructor(private readonly configService: ConfigService) {}

	ACCESS_TOKEN = this.configService.get<string>('MP_ACCESS_TOKEN');
	PUBLIC_KEY = this.configService.get<string>('MP_PUBLIC_KEY');
	CLIENT_ID = this.configService.get<string>('MP_CLIENT_ID');
	CLIENT_SECRET = this.configService.get<string>('MP_CLIENT_SECRET');

	client = new MercadoPagoConfig({ accessToken: this.ACCESS_TOKEN })

	

}