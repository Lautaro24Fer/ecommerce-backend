import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaymentPreferenceReq } from './dto/preference-payment';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { Response } from 'express';

@Injectable()
export class PaymentService {

	constructor(private readonly configService: ConfigService) { }

	ACCESS_TOKEN = this.configService.get<string>('MP_ACCESS_TOKEN');
	PUBLIC_KEY = this.configService.get<string>('MP_PUBLIC_KEY');
	CLIENT_ID = this.configService.get<string>('MP_CLIENT_ID');
	CLIENT_SECRET = this.configService.get<string>('MP_CLIENT_SECRET');

	client = new MercadoPagoConfig({ accessToken: this.ACCESS_TOKEN })


	async createPaymentPreference(bodyItems: IPaymentPreferenceReq, res: Response) {

		console.log(" ===== SERVICE =====")
		const preference = new Preference(this.client)
		preference.create({
			// TODO: La informacón del payer podría venir de la base de datos
			body: {
				items: [...bodyItems.items], 
				back_urls: {
					success: "http://localhost:3000/payment/mp/preference/success",
					failure: "http://localhost:3000/payment/mp/preference/failure",
					pending: "http://localhost:3000/payment/mp/preference/pending"
				},
				auto_return: "approved",
				payment_methods: {
					excluded_payment_methods: [
						{
							id: "master"
						}
					],
					excluded_payment_types: [
						{
							id: "ticket"
						}
					],
					installments: 12
				},
				notification_url: "http://localhost:3000/payment/mp/preference/webhook",
				statement_descriptor: "MINEGOCIO",
				external_reference: "Reference_1234",
				expires: true,
				expiration_date_from: "2023-02-01T12:00:00.000-04:00",
				expiration_date_to: "2025-02-28T12:00:00.000-04:00"
			}
		})
			.then(data => {
				res.json({ status: 201, description: 'The form was created succesfully', url: data.init_point })
			})
			.catch(console.error)

	}
}