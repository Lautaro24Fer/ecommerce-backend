import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Roles } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const ctxHttp = context.switchToHttp();
    const request = ctxHttp.getRequest();

    const token: string = this.extractTokenFromCookie(request, 'user')
    const refreshToken: string = this.extractTokenFromCookie(request, 'refresh')

    if (!token && !refreshToken) {
      throw new UnauthorizedException('any token in header request');
    }

    const refreshTokenPayload: any = await this.verifyTokenOrError(refreshToken)

    if(refreshTokenPayload.error){
      throw new UnauthorizedException({ error: 'session expired' })
    }

    let tokenPayload: any = await this.verifyTokenOrError(token)

    if(tokenPayload.error){     
      throw new UnauthorizedException({ error: 'token expired, refresh the token again' })
    }

    // AUTHORIZARTION

    const roles = this.reflector.get(Roles, context.getHandler());

    if(!roles){

      request['user'] = token;
      request['refresh'] = refreshToken;
      return true;
    }

    const userRoles = (await this.jwtService.decode(token));

    const isAdmin: boolean = userRoles.role.findIndex((r: { name: string; }) => r.name === 'admin') >= 0

    if(isAdmin){

      request['user'] = token;
      request['refresh'] = refreshToken;
      return true;
    }

    if(roles.includes('admin') && !isAdmin){
        
      return false;
    }


    if(roles.includes('user') && (userRoles.role.findIndex((r: { name: string; }) => r.name === 'user') < 0)){
      
      return false;
    }

    request['user'] = token;
    request['refresh'] = refreshToken;

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
