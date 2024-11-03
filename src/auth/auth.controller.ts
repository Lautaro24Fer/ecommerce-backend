import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './auth-google.guard';
import { AuthGuard } from './auth.guard';
import { Roles } from './auth.decorator';
import { InputLoginDto, LoginResponseDto } from './dto/login.dto';
import { SessionStateDto } from './dto/session-state.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/local')

  async login( @Body() login: InputLoginDto, @Res() res: Response ): Promise<void> {

    const { token, refreshToken } = await this.authService.getCookieByLocalAuth(login);

    res.cookie('user', token, {
        maxAge: 1000 * 60 * 5, // Tiempo de vida de la cookie (5 minutos)
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      res.cookie('refresh', refreshToken, {
        maxAge: 1000 * 60 * 7, // Tiempo de vida de la cookie (7 minutos)
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      const responseLogin = new LoginResponseDto(true, 'login succesfully', { token });

      console.log("Response Login");
      console.log(responseLogin);
      res.status(201).json(responseLogin);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async googleLogin() {
    return { msg: 'google authentication' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google/redirect')
  async googleLoginCallback(@Req() req: Request, @Res() res: Response): Promise<void> {

    const error = req.query['error'];

    if((!error) || (error !== 'access_denied')){
      const user: any = { ...req.user };

      const { token, refreshToken } = await this.authService.getCookieByPassportStrategy( user );

      res.cookie('user', token, {
        maxAge: 1000 * 60 * 1, // Tiempo de vida de la cookie (1 minuto)
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      res.cookie('refresh', refreshToken, {
        maxAge: 1000 * 60 * 7, // Tiempo de vida de la cookie (7 minutos)
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return res.redirect('http://localhost:8080'); // Esta es la pagina a donde va a redirigir una vez logeado o no
  }

  @Get('status')
  async isLogged(@Req() req: Request): Promise<SessionStateDto>{
    const refreshToken: any = req.cookies['refresh']
    const accessToken: any = req.cookies['user']
    const response: SessionStateDto = await this.authService.getSessionStatue(accessToken, refreshToken)
    return response;
  }

  
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<Response>{
    const refreshToken: string = req.cookies['refresh']
    if(!refreshToken){
      throw new UnauthorizedException({ error: 'any refresh token, please login again' })
    }
    const response = this.authService.verifyJwtIsExpired(refreshToken)
    if(!response){
      throw new BadRequestException({ error: 'the refresh token was expired, please login again' })
    }
    const accessToken: string = await this.authService.getTokenRefreshed(refreshToken)
    res.cookie('user', accessToken, {
      maxAge: 1000 * 60 * 1, // Tiempo de vida de la cookie (1 minuto)
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
    return res.status(201).json({  essage: 'token refreshed succesfully', token: accessToken })
  }

  @Post('logout')
  logout(@Res() res: Response): Response{
    res.cookie('user', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refresh', '', { httpOnly: true, expires: new Date(0) });
    return res.status(200).json({ message: 'Logout successful' });
  }

  //Endpoint de prueba para testear en swagger
  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Get('test')
  test(){
    return { message: 'this is a authenticated recurse' }
  }
}
