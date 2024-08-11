import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxHttp = context.switchToHttp();
    const request = ctxHttp.getRequest();

    const token: string = this.extractTokenFromCookie(request, 'user')
    const refreshToken: string = this.extractTokenFromCookie(request, 'refresh')

    if (!token && !refreshToken) {
      throw new UnauthorizedException('any token in header request');
    }

    try {
      const refreshTokenPayload: any = await this.verifyTokenOrError(refreshToken)

      if(refreshTokenPayload.error){
        throw new UnauthorizedException({ error: 'session expired' })
      }

      let tokenPayload: any = await this.verifyTokenOrError(token)

      if(tokenPayload.error){     
        throw new UnauthorizedException({ error: 'token expired, refresh the token again' })
      }

      request['user'] = token;
      request['refresh'] = refreshToken;
      
    } 
    catch {
      throw new UnauthorizedException({ error: 'error in the verifiction of the cookie' });
    }

    return true;
  }

  async verifyTokenOrError(token: string): Promise<object>{
    try{
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return {payload}
    }
    catch(error){
      if(error.name === 'TokenExpiredError'){
        return { error: 'Token expired' }
      }
      return { error: 'Invalid token' }
    }
  }

  extractTokenFromCookie(request: Request, alias: string) {
    const token: string = request.cookies[alias]
    return token
  }
}
