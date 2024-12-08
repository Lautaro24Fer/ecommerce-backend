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
import { IUnauthorizedEx } from 'src/global/responseInterfaces';

interface ITokenPayloadOrError {
  error?: string;
  payload?: object;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // if (!context || typeof context.getHandler !== 'function') {
    //   throw new Error('Invalid execution context');
    // }

    const ctxHttp = context.switchToHttp();
    const request = ctxHttp.getRequest();

    const token: string = this.extractTokenFromCookie(request, 'user')
    const refreshToken: string = this.extractTokenFromCookie(request, 'refresh')

    if (!token && !refreshToken) {
      throw new UnauthorizedException('any token in header request');
    }

    const refreshTokenPayload: any = await this.verifyTokenOrError(refreshToken)

    if(refreshTokenPayload?.error){
      const unauthErr: IUnauthorizedEx = {
        status: false,
        message: 'The session expired.'
      }
      throw new UnauthorizedException(unauthErr)
    }

    let tokenPayload: any = await this.verifyTokenOrError(token)

    if(tokenPayload?.error){  
      const unauthErr: IUnauthorizedEx = {
        status: false,
        message: 'The access token is expired. Please refresh the token again'
      };   
      throw new UnauthorizedException(unauthErr)
    }

    // AUTHORIZARTION

    const roles = this.reflector.get(Roles, context?.getHandler());

    if(!roles){

      request['user'] = token;
      request['refresh'] = refreshToken;
      return true;
    }

    const userRoles = (await this.jwtService.decode(token));

    const isAdmin: boolean = userRoles?.role?.findIndex((r: { name: string; }) => r?.name === 'admin') >= 0

    if(isAdmin){

      request['user'] = token;
      request['refresh'] = refreshToken;
      return true;
    }

    if(roles?.includes('admin') && !isAdmin){
        
      return false;
    }


    if(roles?.includes('user') && (userRoles?.role?.findIndex((r: { name: string; }) => r?.name === 'user') < 0)){
      
      return false;
    }

    request['user'] = token;
    request['refresh'] = refreshToken;

    return true;
  }

  async verifyTokenOrError(token: string): Promise<ITokenPayloadOrError>{
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const response: ITokenPayloadOrError = {
        payload
      }
      return response;
    }
    catch(error){
      if(error.name === 'TokenExpiredError'){
        const response: ITokenPayloadOrError = {
          error: 'Token expired'
        }
        return response;
      }
      const response: ITokenPayloadOrError = {
        error: 'Invalid token'
      }
      return response;
    }
  }

  extractTokenFromCookie(request: Request, alias: string) {
    const token: string = request.cookies[alias]
    return token
  }
}
