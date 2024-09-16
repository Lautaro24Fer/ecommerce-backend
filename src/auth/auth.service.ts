import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginResponseDto } from './dto/response-login.dto';
import { InputLoginDto } from './dto/input-login.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { SessionStateDto } from './dto/session-state.dto';
import { UserDto } from 'src/user/dto/user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async validateCredentials( usernameOrEmail: string, password: string ): Promise<User | undefined> {
    
    console.log("VALIDATE CREDENTIALS");
    const userFounded: UserDto = await this.userService.findOneByUsernameOrEmail(usernameOrEmail);
    console.log("-- Usuario encontrado mediante el findOneByUsernameOrEmail --");
    console.log(userFounded);
    console.log("-- Parametro que se pasa al findOneByUsernameEntity --");
    console.log(userFounded.username);
    const user = await this.userService.findOneByUsernameEntity(userFounded.username);
    console.log("-- Usuario encontrado el findOneByUsernameEntity  --")
    console.log(user);
    const isValidated: boolean = await this.userService.comparePasswords( password, user.password );
    console.log("-- las contraseñas coinciden --");
    console.log(isValidated);
    if (!isValidated) {
      throw new UnauthorizedException({ error: "The credentials not match" });
    }
    return user;
  }


  async getCookieByLocalAuth(login: InputLoginDto){

    const userLogin: User = await this.validateCredentials( login.input, login.password);
    try {
      const token: string = await this.getJwtTokenOrBadRequest({ id: userLogin.id, method: userLogin.method, roles: userLogin.roles }, '1m');
      const refreshToken: string = await this.getJwtTokenOrBadRequest({ id: userLogin.id, method: userLogin.method, roles: userLogin.roles }, '7m');
      return { token, refreshToken }
    } 
    catch {
      throw new HttpException( 'error creating the token', HttpStatus.BAD_REQUEST );
    }
  }

  async getCookieByPassportStrategy( user: any ) {

    const userFinded: User = await this.userService.findOne(user?.id);
    const token: string = await this.getJwtTokenOrBadRequest({ id: user?.id, method: user?.method, roles: userFinded.roles }, '1m');
    const refreshToken: string = await this.getJwtTokenOrBadRequest({ id: user?.id, method: user?.method, roles: userFinded.roles }, '7m');
    return { token, refreshToken }
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
