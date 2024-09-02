import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ResetUserPasswordGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {} 

  async canActivate( context: ExecutionContext ): Promise<boolean>  {

    const request: Request = context.switchToHttp().getRequest();

    const jwt = request.cookies['password-reset'];

    if(!jwt){
      throw new UnauthorizedException({ error: 'No jwt in request' });
    }

    const status = await this.verifyTokenOrError(jwt);

    if(status.error && status.error === 'expired'){
      throw new UnauthorizedException({ error: 'The jwt is expired' });
    }

    if(status.error && status.error === 'invalid'){
      throw new UnauthorizedException({ error: 'The jwt is invalid' });
    }

    request.cookies['password-reset'] = jwt;

    return true;
  }

  async verifyTokenOrError(token: string): Promise<any>{
    try{
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload;
    }
    catch(error){
      if(error.name === 'TokenExpiredError'){
        return { error: 'expired' }
      }
      return { error: 'invalid' }
    }
  }
}
