import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JWT_LOCAL_SECRET } from './constaints';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxHttp = context.switchToHttp();
    const request = ctxHttp.getRequest();

    const tokenFromHeader = this.extractTokenFromHeader(request);
    if (!tokenFromHeader) {
      throw new UnauthorizedException('any token in header request');
    }

    try {
      const payload = await this.jwtService.verifyAsync(tokenFromHeader, {
        secret: JWT_LOCAL_SECRET,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('error in the verifiction of the cookie');
    }

    return true;
  }

  extractTokenFromHeader(request: Request) {
    const token: any = request.cookies['token'];
    return token;
  }
}
