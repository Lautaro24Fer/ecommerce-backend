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

@Injectable()
export class PaymentService {

	constructor ( 
		@InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>, 
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly authService: AuthService	 
	) {}

  // OpenPay
	async getTokensFromAPI(): Promise<Payment>{

		const data = {
			grant_type: "client_credentials",
			client_id: this.configService.get<string>('OPENPAY_CLIENT_ID'),
			client_secret: this.configService.get<string>('OPENPAY_CLIENT_SECRET'),
			scope: '*'
		}

		const fetchOptions: any = {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
				body: JSON.stringify(data)
		}

		const apiToken = await fetch(`${this.configService.get<string>('OPENPAY_AUTH_PROD')}/oauth/token`, fetchOptions)
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

		const tokenSaved: Payment = await this.saveTokenOnDb(apiToken)

		return tokenSaved;
	}

	async saveTokenOnDb(token: ITokenReq): Promise<Payment> {

		try{

			if(!token.refresh_token) {
				token.refresh_token = "";
			}
			// const formatedDate: string = (new Date(Number(token.expires_in) * 1000) ).toLocaleString();
			const tokenSetted: any = { ...token  };
			const prevToken: Payment = (await this.paymentRepository.find())[0];
			if(prevToken){
				await this.paymentRepository.remove(prevToken);
			}
			const tokenSaved: Payment = await this.paymentRepository.save(tokenSetted);
			return tokenSaved;
		}
		catch(error){
			console.error(error)
			throw new BadRequestException({ error: "error saving the token" })
		}
	}

	jwtIsExpired(token: Payment): boolean {

		console.log("\n\n === VERIFICACIÓN DEL ESTADO DE EXPIRACIÓN DEL TOKEN ACTUAL ===\n\n");
		console.log("jwtIsExpired --) 1) Fecha del token");
		console.log(token.expires_in);
		console.log("jwtIsExpired --) 2) Fecha formateada a tipo date");
		const expirationDate = new Date(Number(token.expires_in) * 1000);
		console.log(expirationDate)
		console.log("jwtIsExpired --) 3) Fecha actual en tipo date");
		const currentDate = new Date();
		console.log(currentDate)
		console.log("jwtIsExpired --) 4) resultado final de la comparación (el token está vencido?)");
		console.log(currentDate > expirationDate);
		return currentDate > expirationDate;
	}

	async refreshJwtExpired(token: Payment): Promise<Payment> {

		const data = {
			grant_type: "refresh_token",
			client_id: this.configService.get<string>('OPENPAY_CLIENT_ID'),
			client_secret: this.configService.get<string>('OPENPAY_CLIENT_SECRET'),
			refresh_token: token.refresh_token
		}
		
		const fetchOptions = {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}

		const tokenRefreshed: ITokenReq = await fetch(`${this.configService.get<string>('OPENPAY_AUTH_DEV')}/oauth/token`, fetchOptions)
		.then(response => response.json())
		.then(data => data)
		.catch(error => {
			console.error(error)
			throw new BadRequestException({ error: "error refrishing the token"	 })
		});

		const tokenSaved: Payment = await this.saveTokenOnDb(tokenRefreshed);
		return tokenSaved;

	}

	async getTokensFromDatabase(): Promise<Payment> {
		console.log("\n\n== Recuperación de los tokens de la base de datos ==\n\n");
		console.log("getTokensFromDatabase --) 2) Recuperar los tokens mediante el find")
		const dbToken: Payment = (await this.paymentRepository.find())[0];

		console.log("\n\n ===== FIND COMPLETO DE TOKENS ===== \n\n")

		const allTokens: Payment[] = await this.paymentRepository.find();
		console.log(allTokens);

		console.log("\n\n ===== FIND COMPLETO DE TOKENS ===== \n\n")

		console.log("getTokensFromDatabase --) 3) __Token recuperado de la base de datos__")
		console.log(dbToken)

		if(!dbToken ) {
			console.log("\ngetTokensFromDatabase --) 3.1) No se encontró entonces se pedirán directamente desde la api")
			const tokenSaved: Payment = await this.getTokensFromAPI();
			console.log("getTokensFromDatabase --) 3.2) __Token recuperado desde la API__")
			console.log(tokenSaved)
			return tokenSaved; 
		}

		if(this.jwtIsExpired(dbToken)){
			console.log("\ngetTokensFromDatabase --) 4.1) El token existe en la db pero está expirado")

			if(dbToken.refresh_token !== "") {
				console.log("Se refrescará token mediante refreshToken")
				const tokenRefreshed: Payment = await this.refreshJwtExpired(dbToken);
				console.log("\ngetTokensFromDatabase --) 4.2) __token refrescado__");
				console.log(tokenRefreshed)
				return tokenRefreshed
			}
			else {
				console.log("Se refrescará token un nuevo access_token de la api")
				const tokenRefreshed: Payment = await this.getTokensFromAPI();
				console.log("\ngetTokensFromDatabase --) 4.2) __token refrescado__");
				console.log(tokenRefreshed)
				return tokenRefreshed
			}


		}

		console.log("\n\n getTokensFromDatabase --) 4.5) El token no está vencido! \n\n")

		console.log("getTokensFromDatabase --) 5) Token retornado con éxito... \n\n")
		return dbToken;
	}

	async createPaymentPreference(orderData: PaymentPreferenceRequestDto): Promise<IPaymentPreferenceResponse> {
		console.log(`== Creación de la intención de pago ==\n\n`);

		console.log("createPaymentIntent --) .5) data de la order entrante");
		console.log(orderData)
		console.log(JSON.stringify(orderData, null , 2));

		console.log("createPaymentIntent --) 1) Recuperar tokens de la base de datos")
		const token: Payment = await this.getTokensFromDatabase();
		
		console.log("createPaymentIntent --) 2) __Tokens__\n")
		console.log(token);

		const bodyData: PaymentPreferenceRequestDto = {
			...orderData
		}

		bodyData.data.attributes.redirect_urls = {
			success: "http://localhost:3000/payment/success",
			failed: "http://localhost:3000/payment/failed"	
		}

		const fetchOptions = {
			method: 'POST',
			headers: {
				"Content-Type": "application/vnd.api+json",
				"Accept": "application/vnd.api+json",
				"Authorization": `Bearer ${token.access_token}`
			},
			body: JSON.stringify(bodyData)
			}

		console.log("\n\n ======= CORTE PREVIO AL FETCH ======= \n\n");

		const paymentIntent: IPaymentPreferenceResponse = await fetch(`${this.configService.get<string>('OPENPAY_CHECKOUT_PROD')}/api/v2/orders`, fetchOptions)
		.then(response => response.json())
		.then(data => data)
		.catch(error => console.error(error));

		console.log("createPaymentIntent --) 3) __payment intent__\n");
		console.log(paymentIntent);

		return paymentIntent;
	}

	async getOrderStatus(location: string): Promise<any> {

		console.log("====== SOLICITUD DEL ESTADO DE LA ORDEN ======\n\n")
		
		const token: Payment = await this.getTokensFromDatabase();

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

		const order = await fetch(`${this.configService.get<string>('OPENPAY_CHECKOUT_PROD')}${location}`, fetchOptions)
		.then(response => response.json())
		.then(data => data)
		.catch(error => console.error(error))

		console.log(" ______ GET UUID FROM PAYMENT PREFERENCE ______")
		console.log(JSON.stringify(order, null, 2));

		return order;
	}

}