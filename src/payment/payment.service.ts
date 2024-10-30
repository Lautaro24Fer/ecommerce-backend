import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaymentPreference, IPaymentPreferenceReq } from './dto/preference-payment';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';
import { IBadRequestex } from 'src/global/responseInterfaces';

@Injectable()
export class PaymentService {

	constructor(private readonly configService: ConfigService, private readonly userService: UserService) { }

	CLIENT_DOMAIN = this.configService.get<string>('DEV_CLIENT_DOMAIN');
	ACCESS_TOKEN = this.configService.get<string>('MP_ACCESS_TOKEN');
	PUBLIC_KEY = this.configService.get<string>('MP_PUBLIC_KEY');
	CLIENT_ID = this.configService.get<string>('MP_CLIENT_ID');
	CLIENT_SECRET = this.configService.get<string>('MP_CLIENT_SECRET');

	client = new MercadoPagoConfig({ accessToken: this.ACCESS_TOKEN })


	async createPaymentPreference(preferenceData: IPaymentPreferenceReq, res: Response) {

		console.log("\n\n")
		console.log("_______________________________________________________________________")
		console.log("\n\n")

		console.log(" ===== ENTRA SERVICIO PAYMENT =====")
		console.log("preference data (datos que llegan desde el clente)")
		console.log(preferenceData	)
		const preference = new Preference(this.client)
		const expDataFrom = new Date;
		const expDataTo = new Date(Date.now() + (1000 * 60 * 15));

		const payer: UserDto = (await this.userService.findOneById(preferenceData.userId)).recourse;

		const address: Address = payer.address.find(a => a.id === preferenceData.addressId);

		if(!address){

			const badRequestError: IBadRequestex = { status: false, message: `The id address '${preferenceData.addressId}' not exists in the user register` };
			throw new BadRequestException(badRequestError);
		}

		console.log(" ===== SERVICIO PAYMENT=====")
		console.log("payer (usuario recuperado desde la db con la id del preference data)")
		console.log(payer)

		const preferenceBody: IPaymentPreference = {
				items: [...preferenceData.items], 
				back_urls: {
					success: `${this.CLIENT_DOMAIN}/success`,
					failure: `${this.CLIENT_DOMAIN}/failure`,
					pending: `${this.CLIENT_DOMAIN}/pending`
				},
				payer: {
					name: payer.name,
					surname: payer.surname,
					email: payer.email,
					identification: {
						type: payer.idType.name,
						number: payer.idNumber
					},
					address: {
						street_name: address.addressStreet ?? "",
						street_number: address.addressNumber ?? "",	
						zip_code: address.postalCode
					}
				},
				auto_return: "approved",
				payment_methods: {
					excluded_payment_methods: [],
					excluded_payment_types: [
            {
              id: "ticket"
            }
       	  ],
					installments: 12
				},
				notification_url: "",
				statement_descriptor: "PADEL POINT",
				external_reference: "Padel Point",
				expires: true,
				expiration_date_from: expDataFrom.toISOString(),
				expiration_date_to: expDataTo.toISOString()
		}

		preference.create({
			body: { ...preferenceBody }
		})
			.then(data => {
				res.json({ status: 201, description: 'The form was created succesfully', url: data.init_point })
			})
			.catch(console.error)

	}
}