import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResendService } from 'nestjs-resend';
import { Resend } from 'resend';
import { resetPasswordLayout } from './layouts/change-password-code';

@Injectable()
export class EmailService {

	private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
		this.resend = new Resend(configService.get<string>('RESEND_API_KEY'))
	}

  async sendEmailForResetPassword(token: number, toUser: string){

		const layout: string = resetPasswordLayout(token);

		await this.resend.emails.send({
			from: `no reply <${this.configService.get<string>('RESEND_FROM_EMAIL')}>`, // Acá iría el correo que está verificado con el dominio en resend
			to: [toUser], // Estos serían los receptores, si es uno no es necesario ponerlo dentro de un array
			subject: "Padel point - Reset password code", // Este sería el 'asunto'
			html: layout, // Correo en html
		}).then((data) => {
			console.log("El correo fue enviado con éxito")
			console.log("Esta es la data:")
			console.log(data)
		})
		.catch((error) => {
			console.error(error);
		})
	}
}


