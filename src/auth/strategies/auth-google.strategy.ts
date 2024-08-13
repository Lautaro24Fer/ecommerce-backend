import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import {
  oauth_client_id,
  oauth_client_secret,
  oauth_google_redirect_url,
} from '../constaints';
import { config } from 'process';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const clientIDVar = configService.get<string>('OAUTH_CLIENT_ID');
    const clientSecretVatr = configService.get<string>('OAUTH_CLIENT_SECRET');
    const callbackURLVar = configService.get<string>(
      'OAUTH_GOOGLE_REDIRECT_URL',
    );

    super({
      clientID: clientIDVar,
      clientSecret: clientSecretVatr,
      callbackURL: callbackURLVar,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const usernameNull = `username.null.${Date.now() + 1}`;
    const user: User = await this.userService.validateUserWithStrategy({
      name: profile.displayName,
      username: profile.username ?? usernameNull,
      method: 'google',
      email: profile.emails[0].value,
      password: '',
      // Investigar más si se puede guardar la contraseña como cadena vacía par los logins OAUTH
    });
    return user || null;
  }
}
