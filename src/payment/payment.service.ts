import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaymentPreference, IPaymentPreferenceReq } from './dto/preference-payment';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { Response } from 'express';

@Injectable()
export class PaymentService {

	constructor(private readonly configService: ConfigService) { }

	CLIENT_DOMAIN = this.configService.get<string>('DEV_CLIENT_DOMAIN');
	ACCESS_TOKEN = this.configService.get<string>('MP_ACCESS_TOKEN');
	PUBLIC_KEY = this.configService.get<string>('MP_PUBLIC_KEY');
	CLIENT_ID = this.configService.get<string>('MP_CLIENT_ID');
	CLIENT_SECRET = this.configService.get<string>('MP_CLIENT_SECRET');

	client = new MercadoPagoConfig({ accessToken: this.ACCESS_TOKEN })


	async createPaymentPreference(bodyItems: IPaymentPreferenceReq, res: Response) {

		console.log(" ===== SERVICE =====")
		const preference = new Preference(this.client)
		const expDataFrom = new Date;
		const expDataTo = new Date(Date.now() + (1000 * 60 * 15))
		const preferenceBody: IPaymentPreference = {
				items: [...bodyItems.items], 
				back_urls: {
					success: `${this.CLIENT_DOMAIN}/success`,
					failure: `${this.CLIENT_DOMAIN}/failure`,
					pending: `${this.CLIENT_DOMAIN}/pending`
				},
				payer: {
					name: "Lautaro",
					surname: "Fernandez",
					email: "lautarofer456@gmail.com",
					identification: {
						type: "DNI",
						number: "12345678"
					},
					address: {
						street_name: "Street",
						street_number: "123",	
						zip_code: "5700"
					}
				},
				auto_return: "approved",
				payment_methods: {
					excluded_payment_methods: [],
					excluded_payment_types: [],
					installments: 12
				},
				notification_url: "http://localhost:3000/payment/mp/preference/webhook",
				statement_descriptor: "PADEL POINT",
				external_reference: "Padel Point",
				expires: true,
				expiration_date_from: expDataFrom.toISOString(),
				expiration_date_to: expDataTo.toISOString()
		}

		console.log("Preference body")
		console.log(preferenceBody)
		preference.create({
			body: { ...preferenceBody }
		})
			.then(data => {
				res.json({ status: 201, description: 'The form was created succesfully', url: data.init_point })
			})
			.catch(console.error)

	}
}