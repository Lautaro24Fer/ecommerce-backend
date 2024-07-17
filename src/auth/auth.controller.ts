import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InputLoginDto } from './dto/input-login.dto';
import { LoginResponseDto } from './dto/response-login.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body() login: InputLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    const loginResponse: LoginResponseDto = await this.authService.getToken(
      login,
      res,
    );
    return res.status(201).json(loginResponse);
  }
}
