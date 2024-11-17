import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResendService } from 'nestjs-resend';
import { Resend } from 'resend';
import { resetPasswordLayout } from './layouts/change-password-code';
import * as nodemailer from 'nodemailer';
import { IBadRequestex, IRecourseCreated } from 'src/global/responseInterfaces';

@Injectable()
export class EmailService {

	transporter: nodemailer.Transporter;
	NODEMAILER_HOST: string;
	NODEMAILER_PORT: number;
	NODEMAILER_USER: string;
	NODEMAILER_PASSWORD: string;

  constructor(private readonly configService: ConfigService) {

		this.NODEMAILER_HOST = configService.get<string>('NM_HOST');
		this.NODEMAILER_PORT = configService.get<number>('NM_PORT');
		this.NODEMAILER_USER = configService.get<string>('NM_USER');
		this.NODEMAILER_PASSWORD = configService.get<string>('NM_PASSWORD');

		this.transporter = nodemailer.createTransport({
			host: this.NODEMAILER_HOST,
			port: this.NODEMAILER_PORT, 
			secure: true, 
			auth: {
				user: this.NODEMAILER_USER, 
				pass: this.NODEMAILER_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false, // Permitir certificados no válidos (útil para servidores internos)
			},
		});
	}

	async sendEmailForResetPassword(token: number, toUser: string){

		console.log(" ____ constructor _____")
		console.log("nodemailer_host: " + this.NODEMAILER_HOST);
		console.log("nodemailer_port: " + this.NODEMAILER_PORT);
		console.log("nodemailer_user: " + this.NODEMAILER_USER);
		console.log("nodemailer_password: " + this.NODEMAILER_PASSWORD);

		const layout: string = resetPasswordLayout(token);

		const info: IRecourseCreated<any> = await this.transporter.sendMail({
			from: `no reply <${this.NODEMAILER_USER}>`,
			to: [toUser],
			subject: "Padel point - Reset password code", // Asunto
			html: layout
		}).then((data) => {
			console.log("____data____\n\n")
			console.log(data)
			console.log("\n\n_________________\n\n")
			const recourseCreated: IRecourseCreated<any> = {
				status: true,
				message: "The reset password mail was sended succesfully",
				recourse: data
			};
			return recourseCreated;
		}).catch((error) => {
			console.error(error);
			const badRequestError: IBadRequestex = {
				status: false,
				message: "The reset password mail was not sended. An error ocurred"
			};
			throw new BadRequestException(badRequestError);
		});
		return info;
	}

}


