import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginResponseDto } from './dto/response-login.dto';
import { InputLoginDto } from './dto/input-login.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async validateCredentials( username: string, password: string ): Promise<User | undefined> {
    const userFounded = await this.userService.findOneByUsernameEntity(username);
    const isValidated: boolean = await this.userService.comparePasswords( password, userFounded.password );
    if (!isValidated) {
      throw new UnauthorizedException('the credentials not match');
    }
    return userFounded;
  }

  async getCookieByLocalAuth( login: InputLoginDto, res: Response ): Promise<LoginResponseDto | undefined> {
    const userLogin = await this.validateCredentials( login.username, login.password);
    try {
      const token: string = await this.getJwtTokenOrBadRequest({ id: userLogin.id, method: userLogin.method, }, '1m');
      const refreshToken: string = await this.getJwtTokenOrBadRequest({ id: userLogin.id, method: userLogin.method }, '5m');
      res.cookie('user', token, {
        maxAge: 1000 * 60, // Tiempo de vida de la cookie (1 minuto)
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      res.cookie('refresh', refreshToken, {
        maxAge: 1000 * 60 * 5, // Tiempo de vida de la cookie (5 minutos)
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      const responseLogin = new LoginResponseDto(true, 'login succesfully');
      return responseLogin;
    } 
    catch {
      throw new HttpException( 'error creating the token', HttpStatus.BAD_REQUEST );
    }
  }

  async getCookieByPassportStrategy( res: Response, user: any, ): Promise<void | undefined> {
    const tokenPayload: string = await this.getJwtTokenOrBadRequest({ id: user?.id, method: user?.method }, '1m');
    const refreshToken: string = await this.getJwtTokenOrBadRequest({ id: user?.id, method: user?.method }, '5h');
    res.cookie('user', tokenPayload, {
      maxAge: 1000 * 60, // Tiempo de vida de la cookie (1 minuto)
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('refresh', refreshToken, {
      maxAge: 1000 * 60 * 5, // Tiempo de vida de la cookie (5 minutos)
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  async getJwtTokenOrBadRequest( payload: any, timeToExpire: string, ): Promise<string | undefined> {
    try {
      const cookieCrypted = await this.jwtService.signAsync( payload, { expiresIn: timeToExpire });
      return cookieCrypted;
    }
    catch {
      throw new HttpException( 'error creating the token', HttpStatus.BAD_REQUEST );
    }
  }
}
