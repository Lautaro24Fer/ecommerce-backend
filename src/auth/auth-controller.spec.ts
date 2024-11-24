import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InputLoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { IRecourseCreated, IRecourseDeleted } from 'src/global/responseInterfaces';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getCookieByLocalAuth: jest.fn(),
            verifyJwtIsExpired: jest.fn(),
            getTokenRefreshed: jest.fn(),
            getSessionStatue: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should login with valid credentials', async () => {
    const loginDto: InputLoginDto = { usernameOrEmail: 'test@example.com', password: 'validPassword' };
    const res: Partial<Response> = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(authService, 'getCookieByLocalAuth').mockResolvedValue({
      token: 'testToken',
      refreshToken: 'testRefreshToken',
    });

    await authController.login(loginDto, res as Response);

    expect(res.cookie).toHaveBeenCalledWith('user', 'testToken', expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith('refresh', 'testRefreshToken', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ status: true, message: 'login succesfully' });
  });

  it('should throw UnauthorizedException for short password', async () => {
    const loginDto: InputLoginDto = { usernameOrEmail: 'test@example.com', password: 'short' };
    const res: Partial<Response> = {};

    await expect(authController.login(loginDto, res as Response)).rejects.toThrow(UnauthorizedException);
  });

  it('should refresh token with valid refresh token', async () => {
    const req = { cookies: { refresh: 'validRefreshToken' } } as unknown as Request;
    const res: Partial<Response> = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(authService, 'verifyJwtIsExpired').mockResolvedValue(true);
    jest.spyOn(authService, 'getTokenRefreshed').mockResolvedValue('newAccessToken');

    await authController.refreshToken(req, res as Response);

    expect(res.cookie).toHaveBeenCalledWith('user', 'newAccessToken', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'Token refreshed succesfully',
      recourse: 'newAccessToken',
    });
  });

  it('should throw UnauthorizedException for expired refresh token', async () => {
    const req = { cookies: { refresh: 'expiredToken' } } as unknown as Request;
    const res: Partial<Response> = {};

    jest.spyOn(authService, 'verifyJwtIsExpired').mockResolvedValue(false);

    await expect(authController.refreshToken(req, res as Response)).rejects.toThrow(UnauthorizedException);
  });

  it('should logout successfully', () => {
    const res: Partial<Response> = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    authController.logout(res as Response);

    expect(res.cookie).toHaveBeenCalledWith('user', '', { httpOnly: true, expires: new Date(0) });
    expect(res.cookie).toHaveBeenCalledWith('refresh', '', { httpOnly: true, expires: new Date(0) });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'Logout successfully',
      recourse: null,
    });
  });
});