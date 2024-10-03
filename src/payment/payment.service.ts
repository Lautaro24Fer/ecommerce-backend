import { Injectable } from '@nestjs/common';
import { IPaymentPreferenceRequest, ITokenReq } from './dto/preference-payment';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

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
			grant_type: "client-credentials",
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

		const apiToken: ITokenReq = await fetch(`${this.configService.get<string>('OPENPAY_AUTH_PROD')}/oauth/token`, fetchOptions)
		.then(response => response.json())
		.then(data => data)
		.catch(error => console.error(error));

		const tokenSaved: Payment = await this.saveTokenOnDb(apiToken)

		return tokenSaved;
	}

	async saveTokenOnDb(token: ITokenReq): Promise<Payment> {

		const formatedDate: string = (new Date(Number(token.expires_in) * 1000) ).toLocaleString();
		const tokenSetted: Payment = { ...token, expires_in: formatedDate };
		const prevToken: Payment = await this.paymentRepository.find()[0];
		if(prevToken){
			await this.paymentRepository.remove(prevToken);
		}
		const tokenSaved: Payment = await this.paymentRepository.save(tokenSetted);
		return tokenSaved;
	}

	jwtIsExpired(token: Payment): boolean {

		const expirationDate = new Date(token.expires_in);
		const currentDate = new Date();
		return currentDate < expirationDate
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

		const tokenRefreshed: ITokenReq = await fetch(`${this.configService.get<string>('OPENPAY_AUTH_PROD')}/oauth/token`, fetchOptions)
		.then(response => response.json())
		.then(data => data)
		.catch(error => console.error(error));

		const tokenSaved = await this.saveTokenOnDb(tokenRefreshed);
		return tokenSaved;

	}

	async getTokensFromDatabase(): Promise<Payment> {
		console.log("\n\n== Recuperación de los tokens de la base de datos ==\n\n");
		console.log("getTokensFromDatabase --) 2) Recuperar los tokens mediante el find")
		const dbToken: Payment = await this.paymentRepository.find()[0];
		console.log("getTokensFromDatabase --) 3) __Token recuperado de la base de datos__")
		console.log(dbToken)
		if(!dbToken ) {
			console.log("getTokensFromDatabase --) 3.1) No se encontró entonces se pedirán directamente desde la api")
			const tokenSaved: Payment = await this.getTokensFromAPI();
			console.log("getTokensFromDatabase --) 3.2) __Token recuperado desde la API__")
			console.log(tokenSaved)
			return tokenSaved; 
		}

		if(this.jwtIsExpired(dbToken)){
			console.log("getTokensFromDatabase --) 4.1) El token existe en la db pero está expirado")
			const tokenRefreshed: Payment = await this.refreshJwtExpired(dbToken);
			console.log("getTokensFromDatabase --) 4.2) __token refrescado__")
			console.log(tokenRefreshed)
			return tokenRefreshed;
		}

		console.log("getTokensFromDatabase --) 5) Token retornado con éxito... \n\n")
		return dbToken;
	}

	async createPaymentIntent(orderData: IPaymentPreferenceRequest) {
		console.log(`== Creación de la intención de pago ==\n\n`);
		console.log("createPaymentIntent --) 1) Recuperar tokens de la base de datos")
		const token: Payment = await this.getTokensFromDatabase();
		
		console.log("createPaymentIntent --) __Tokens__\n")
		console.log(token);

		


	}

}