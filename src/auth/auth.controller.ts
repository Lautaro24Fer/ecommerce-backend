import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login/local')
  async login(
    @Body() login: InputLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    const loginResponse: LoginResponseDto = await this.authService.getToken(
      login,
      res,
    );
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

    const tokenPayload: string = await this.jwtService.signAsync({
      id: user.id,
    });

    res.cookie('user', tokenPayload, {
      maxAge: 1000 * 60 * 5, // Tiempo de vida de la cookie
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.redirect('http://localhost:8080'); // Esta es la pagina a donde va a redirigir una vez logeado
  }
}
