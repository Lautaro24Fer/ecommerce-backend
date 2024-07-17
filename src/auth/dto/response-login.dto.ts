export class LoginResponseDto {
  status: boolean;
  message: string;
  token?: any;

  constructor(status: boolean, message: string, token?: any) {
    this.status = status;
    this.message = message;
    this.token = token;
  }
}
