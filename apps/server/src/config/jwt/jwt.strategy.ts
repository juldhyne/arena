import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Same as in JwtModule
    });
  }

  async validate(payload: any) {
    // payload is what you signed in authService.sign()
    return {
      uid: payload.uid,
      email: payload.email,
      username: payload.username,
    };
  }
}
