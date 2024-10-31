import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InputLoginDto } from './dto/input-login.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { SessionStateDto } from './dto/session-state.dto';
import { IBadRequestex, IUnauthorizedEx } from 'src/global/responseInterfaces';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  
  async validateCredentials( usernameOrEmail: string, password: string ): Promise<User | undefined> {
    
    const user: User = await this.userService.findOneByUsernameOrEmail(usernameOrEmail);
    const isValidated: boolean = await this.userService.comparePasswords( password, user.password );
    console.log(isValidated);
    if (!isValidated) {
      const unauthorizedError: IUnauthorizedEx = {
        status: false,
        message: "The credentials not match"
      }
      throw new UnauthorizedException(unauthorizedError);
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
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error in the creation of the token by local auth"
      };
      throw new BadRequestException(badRequestError);
    }
  }

  async getCookieByPassportStrategy( user: any ) {

    const userFinded: User = (await this.userService.findOneById(user?.id)).recourse; 
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
    const response: boolean = await this.jwtService.verifyAsync(jwt, { secret: this.configService.get<string>('JWT_SECRET') }).then((_) => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    })
    return response;
  }
  async getTokenRefreshed(refreshToken: string): Promise<string>{
    const payload: any = await this.jwtService.verifyAsync(refreshToken, { secret: this.configService.get<string>('JWT_SECRET') }).catch((error) => {
      console.error(error);
      const response: IBadRequestex = {
        status: false,
        message: "Error decoding the payload of the refresh token"
      };
      throw new BadRequestException(response);
    });
    const accessToken: string = await this.getJwtTokenOrBadRequest({ id: payload.id, method: payload.method }, '1m');
    return accessToken;
  }
}
