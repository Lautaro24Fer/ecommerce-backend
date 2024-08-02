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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async validateCredentials(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const userFounded = await this.userService.findOneByUserName(username);
    const isValidated: boolean = await this.userService.comparePasswords(
      password,
      userFounded.password,
    );
    if (!isValidated) {
      throw new UnauthorizedException('the credentials not match');
    }
    return userFounded;
  }

  async getToken(
    login: InputLoginDto,
    res: Response,
  ): Promise<LoginResponseDto | undefined> {
    const userLogin = await this.validateCredentials(
      login.username,
      login.password,
    );

    try {
      const payload = { id: userLogin?.id, username: userLogin?.username };

      const token = await this.jwtService.signAsync(payload);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 30,
      });

      const responseLogin = new LoginResponseDto(
        true,
        'login succesfully',
        token,
      );

      return responseLogin;
    } catch {
      throw new HttpException(
        'error creating the token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
