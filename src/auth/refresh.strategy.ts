import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private usersService: UsersService) {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const refreshToken = req.body.refreshToken;
    const user = await this.usersService.findById(payload.id);

    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    return { id: payload.id, refreshToken };
  }
}
