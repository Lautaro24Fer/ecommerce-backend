import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InputLoginDto } from './dto/input-login.dto';
import { LoginResponseDto } from './dto/response-login.dto';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './auth-google.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/local')
  async login( @Body() login: InputLoginDto, @Res() res: Response ): Promise<any> {
    const loginResponse: LoginResponseDto = await this.authService.getCookieByLocalAuth(login, res);
    return res.status(201).json(loginResponse);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async googleLogin() {
    return { msg: 'google authentication' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google/redirect')
  async googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    const user: any = { ...req.user };

    await this.authService.getCookieByPassportStrategy(res, user);

    return res.redirect('http://localhost:8080'); // Esta es la pagina a donde va a redirigir una vez logeado
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {

  }
}
