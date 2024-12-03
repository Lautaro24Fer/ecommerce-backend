import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InputLoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { LoginMethodType } from '../global/enum';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByUsernameOrEmail: jest.fn(),
            comparePasswords: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('test_validate_credentials_google_login_attempt', async () => {
    const user = new User();
    user.method = LoginMethodType.GOOGLE;
    jest.spyOn(userService, 'findOneByUsernameOrEmail').mockResolvedValue({
      status: true,
      message: "",
      recourse: user
    });

    await expect(authService.validateCredentials('googleuser@example.com', 'password'))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('test_get_cookie_by_local_auth_valid_credentials', async () => {
    const user = new User();
    user.id = 1;
    user.method = LoginMethodType.LOCAL;
    user.roles = [];
    jest.spyOn(authService, 'validateCredentials').mockResolvedValue(user);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

    const loginDto = new InputLoginDto();
    loginDto.usernameOrEmail = 'user@example.com';
    loginDto.password = 'password';

    const tokens = await authService.getCookieByLocalAuth(loginDto);

    expect(tokens).toHaveProperty('token', 'token');
    expect(tokens).toHaveProperty('refreshToken', 'token');
  });

  it('test_get_session_statue_missing_refresh_token', async () => {
    const sessionState = await authService.getSessionStatue('accessToken', '');

    expect(sessionState.isLogged).toBe(false);
    expect(sessionState.refreshTokenExists).toBe(false);
    expect(sessionState.message).toBe('Session expired. Please login again');
  });
});