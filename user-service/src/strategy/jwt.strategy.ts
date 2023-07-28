import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret } from 'src/app.module';
import { AppService } from '../app.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private appService: AppService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JWT_SECRET',
    });
  }

  async validate(payload: { email: string; role: string }) {
    const user = await this.appService.findByEmail(payload.email);

    if (payload.role === 'user' && !user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
