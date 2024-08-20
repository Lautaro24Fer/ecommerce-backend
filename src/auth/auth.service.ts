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
import { SessionStateDto } from './dto/session-state.dto';
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
    const user: User = await this.userService.findOneByUserName(login.username);

    try {
      const token: string = await this.getJwtTokenOrBadRequest({ id: userLogin.id, method: userLogin.method, role: user.roles }, '1m');
      const refreshToken: string = await this.getJwtTokenOrBadRequest({ id: userLogin.id, method: userLogin.method, role: user.roles }, '7m');
      res.cookie('user', token, {
        maxAge: 1000 * 60 * 5, // Tiempo de vida de la cookie (5 minuto)
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

      const responseLogin = new LoginResponseDto(true, 'login succesfully', { token, refreshToken });
      return responseLogin;
    } 
    catch {
      throw new HttpException( 'error creating the token', HttpStatus.BAD_REQUEST );
    }
  }
  async getCookieByPassportStrategy( res: Response, user: any, ): Promise<void | undefined> {

    const userFinded: User = await this.userService.findOne(user?.id);
    const tokenPayload: string = await this.getJwtTokenOrBadRequest({ id: user?.id, method: user?.method, roles: userFinded.roles }, '1m');
    const refreshToken: string = await this.getJwtTokenOrBadRequest({ id: user?.id, method: user?.method, roles: userFinded.roles }, '7m');
    res.cookie('user', tokenPayload, {
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
  async getJwtTokenOrBadRequest( payload: any, timeToExpire: string, ): Promise<string | undefined> {
    try {
      const cookieCrypted = await this.jwtService.signAsync( payload, { expiresIn: timeToExpire });
      return cookieCrypted;
    }
    catch {
      throw new HttpException( 'error creating the token', HttpStatus.BAD_REQUEST );
    }
  }
  async getSessionStatue(accessToken: string, refreshToken: string): Promise<object>{
    const sessionState: SessionStateDto = new SessionStateDto();
    if(!refreshToken || refreshToken === ''){
      sessionState.message = 'Session expired. Please login again';
      return sessionState;
    }
    if(!accessToken || accessToken === ''){
      sessionState.refreshTokenExists = true;
      sessionState.message = 'Access token expired or not exists. Please refresh token';
      return sessionState;
    }
    try{
      const payload = await this.jwtService.verifyAsync(accessToken, { secret: this.configService.get<string>('JWT_SECRET') });
      sessionState.isLogged = true;
      sessionState.refreshTokenExists = true;
      sessionState.message = 'The session is currently active now';
      sessionState.payload = payload;
      return sessionState;
    }
    catch(error){
      if(error.name === 'TokenExpiredError'){
        sessionState.message = 'The token is expired.';
        return sessionState;
      }
      sessionState.message = 'The token is invalid.';
      return sessionState;

    }
  }
  async verifyJwtIsExpired(jwt: string): Promise<boolean>{
    try{
    const response: any = this.jwtService.verifyAsync(jwt, { secret: this.configService.get<string>('JWT_SECRET') })
    return true
    }
    catch{
      return false
    }
  }
  async getTokenRefreshed(refreshToken: string): Promise<string>{
    const payload: any = await this.jwtService.verifyAsync(refreshToken, { secret: this.configService.get<string>('JWT_SECRET') });
    const accessToken: string = await this.getJwtTokenOrBadRequest({ id: payload.id, method: payload.method }, '1m');
    return accessToken;
  }
}
