import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;
  let reflector: Reflector;

  beforeEach(() => {
    jwtService = new JwtService();
    configService = new ConfigService();
    reflector = new Reflector();
    authGuard = new AuthGuard(jwtService, configService, reflector);
  });

  const mockContext: Partial<ExecutionContext> = {
    getHandler: jest.fn().mockReturnValue(undefined), // Simula que no hay roles específicos en la ruta
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        cookies: {
          user: 'validAccessToken',
          refresh: 'validRefreshToken',
        },
      }),
    }),
  };

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should throw UnauthorizedException if no tokens are present', async () => {
    const context = createMockExecutionContext({});
    await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if refresh token is expired', async () => {
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ error: 'Token expired' });
    const context = createMockExecutionContext({ refresh: 'expiredRefreshToken' });
    await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user token is expired', async () => {
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simulate valid refresh token
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ error: 'Token expired' });
    const context = createMockExecutionContext({ user: 'expiredUserToken', refresh: 'validRefreshToken' });
    await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should allow access if no specific roles are required', async () => {
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simulate valid refresh token
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simulate valid user token
    jest.spyOn(reflector, 'get').mockReturnValue(null); // No roles required
    
    const canActivate = await authGuard.canActivate(mockContext as ExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should allow access if no specific roles are required', async () => {
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simulate valid refresh token
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simulate valid user token
    jest.spyOn(reflector, 'get').mockReturnValue(null); // No roles required
    
    const canActivate = await authGuard.canActivate(mockContext as ExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should allow access if user has admin role', async () => {

    // jest.spyOn(authGuard['jwtService'], 'decode').mockReturnValue({ role: [{ name: 'admin' }] });
    // jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simula token de refresh válido
    // jest.spyOn(reflector, 'get').mockReturnValue(['admin']); // El handler requiere el rol 'admin'
    // const canActivate = await authGuard.canActivate(mockContext as ExecutionContext);
    // expect(canActivate).toBe(true);
  });

  it('should deny access if user does not have admin role', async () => {
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simulate valid refresh token
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: { role: [{ name: 'user' }] } }); // Simulate non-admin role
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    
    const canActivate = await authGuard.canActivate(mockContext as ExecutionContext);
    expect(canActivate).toBe(false);
  });

  it('should deny access if user does not have user role', async () => {
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simulate valid refresh token
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: { role: [{ name: 'admin' }] } }); // Simulate non-user role
    jest.spyOn(reflector, 'get').mockReturnValue(['user']);
    
    const canActivate = await authGuard.canActivate(mockContext as ExecutionContext);
    expect(canActivate).toBe(false);
  });

  it('should allow access with valid tokens and correct roles', async () => {
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: {} }); // Simulate valid refresh token
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ payload: { role: [{ name: 'user' }] } }); // Simulate user role
    jest.spyOn(reflector, 'get').mockReturnValue(['user']);
    
    const canActivate = await authGuard.canActivate(mockContext as ExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    jest.spyOn(authGuard, 'verifyTokenOrError').mockResolvedValueOnce({ error: 'Invalid token' });
    const context = createMockExecutionContext({ user: 'invalidUserToken', refresh: 'validRefreshToken' });
    await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  function createMockExecutionContext(cookies: Record<string, string>): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies,
        }),
      }),
    } as unknown as ExecutionContext;
  }
});