import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID') || 'dummy_client_id',
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET') || 'dummy_secret',
      callbackURL: configService.get<string>('MICROSOFT_CALLBACK_URL') || 'http://localhost:3000/api/auth/microsoft/callback',
      scope: ['user.read'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { displayName, emails, id } = profile;
    const user = {
      microsoftId: id,
      email: emails[0].value,
      fullName: displayName,
      accessToken,
    };
    done(null, user);
  }
}
