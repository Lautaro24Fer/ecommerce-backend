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

    const tokenFromHeader = this.extractTokenFromHeader(request);
    if (!tokenFromHeader) {
      throw new UnauthorizedException('any token in header request');
    }

    try {
      const payload = await this.jwtService.verifyAsync(tokenFromHeader, {
        secret: this.configService.get<string>('JWT_SECRET'),
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
