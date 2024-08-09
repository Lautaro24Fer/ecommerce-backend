import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxHttp = context.switchToHttp();
    const request = ctxHttp.getRequest();

    const { token, refreshToken } = this.extractTokensFromHeader(request);
    if (!token && !refreshToken) {
      throw new UnauthorizedException('any token in header request');
    }

    try {
      let tokenPayload: any = await this.verifyTokenOrError(token)
      const refreshTokenPayload: any = await this.verifyTokenOrError(refreshToken)

      if(tokenPayload.error){
        if(refreshTokenPayload.error){
          throw new UnauthorizedException({ error: 'session expired' })
        }
        tokenPayload = await this.jwtService.signAsync(refreshTokenPayload, { expiresIn: '1m' })
      }

      request['user'] = tokenPayload;
      request['refresh'] = refreshToken;
      
    } 
    catch {
      throw new UnauthorizedException('error in the verifiction of the cookie');
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

  extractTokensFromHeader(request: Request) {
    const token: any = request.cookies['user'];
    const refreshToken: any = request.cookies['refresh'];
    return { token, refreshToken };
  }
}
