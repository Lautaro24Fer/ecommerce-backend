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

@Injectable()
export class PaymentService {

	constructor ( 
		@InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>, 
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly OP_CLIENT_ID: string,
		private readonly OP_CLIENT_SECRET: string,
		private readonly OP_AUTH_PROD: string,
		private readonly OP_CHECKOUT_PROD: string,
		private readonly OP_JWT_SECRET: string
	) {

			OP_AUTH_PROD = this.configService.get<string>('OPENPAY_AUTH_PROD');
			OP_CHECKOUT_PROD = this.configService.get<string>('OPENPAY_CHECKOUT_PROD');
			OP_CLIENT_ID = this.configService.get<string>('OPENPAY_CLIENT_ID');
			OP_CLIENT_SECRET = this.configService.get<string>('OPENPAY_CLIENT_SECRET');
			OP_JWT_SECRET = this.configService.get<string>('OPENPAY_JWT_SECRET');
	}

  // OpenPay
	async getTokensFromAPI(): Promise<string>{

		const data = {
			grant_type: "client_credentials",
			client_id: this.OP_CLIENT_ID,
			client_secret: this.OP_CLIENT_SECRET,
			scope: '*'
		}

		const fetchOptions: any = {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
				body: JSON.stringify(data)
		}

		const apiToken: ITokenReq = await fetch(`${this.OP_AUTH_PROD}/oauth/token`, fetchOptions)
		.then(response => response.json())
		.then(data => data)
		.catch(error => {
			console.error(error);
			throw new BadRequestException({ error: "error taking tokens from API" });
		});

		console.log("getTokenFromAPI --) respuesta de la api: \n")
		console.log(apiToken)
		console.log("\n")
		if(!apiToken) {
			console.log("getTokenFromAPI --) esfalso")
		}

		try{

			const tokenJwt: string = await this.jwtService.signAsync(apiToken, { secret: this.OP_JWT_SECRET })
			return tokenJwt;
		}
		catch(error){
			throw new BadRequestException({ message: error })
		}
	}

	async verifyJwtAsync(jwt: string, secret: string): Promise<any> {

		try {
			const token: any = await this.jwtService.verifyAsync(jwt, { secret });
			return token;
		} catch (error) {
			throw new BadRequestException({ error: 'Error decoding jwt' })
		}
	}

	async createPaymentPreference(orderData: PaymentPreferenceRequestDto, token: string): Promise<IPaymentPreferenceResponse> {

		const bodyData: PaymentPreferenceRequestDto = {
			...orderData
		}

		bodyData.data.attributes.redirect_urls = {
			success: "http://localhost:3000/payment/success",
			failed: "http://localhost:3000/payment/failed"	
		}

		const tokenDecoded: ITokenReq = await this.verifyJwtAsync(token, this.OP_JWT_SECRET);

		const fetchOptions = {
			method: 'POST',
			headers: {
				"Content-Type": "application/vnd.api+json",
				"Accept": "application/vnd.api+json",
				"Authorization": `Bearer ${tokenDecoded.access_token}`
			},
			body: JSON.stringify(bodyData)
			}

		console.log("\n\n ======= CORTE PREVIO AL FETCH ======= \n\n");

		const paymentIntent: IPaymentPreferenceResponse = await fetch(`${this.OP_CHECKOUT_PROD}/api/v2/orders`, fetchOptions)
		.then(response => response.json())
		.then(data => data)
		.catch(error => console.error(error));

		console.log("createPaymentIntent --) 3) __payment intent__\n");
		console.log(paymentIntent);

		return paymentIntent;
	}

	async getOrderStatus(location: string): Promise<any> {

		console.log("====== SOLICITUD DEL ESTADO DE LA ORDEN ======\n\n")
		
		const token = { access_token: "" } // OBJETO TEMPORAL PARA EVITAR ERRRORES DE SINTAXIS

		console.log("getOrderStatus --) 1) token que se usará");
		console.log(token);

		const fetchOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',	
				'Accept': 'application/vnd.api+json',
				'Authorization': `Bearer ${token.access_token}`
			}
		}

		const order = await fetch(`${this.OP_CHECKOUT_PROD}${location}`, fetchOptions)
		.then(response => response.json())
		.then(data => data)
		.catch(error => console.error(error))

		console.log(" ______ GET UUID FROM PAYMENT PREFERENCE ______")
		console.log(JSON.stringify(order, null, 2));

		return order;
	}

}