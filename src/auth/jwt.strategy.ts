import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

interface AccessJwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: AccessJwtPayload) {
    // Optionally: ensure user still exists or is not deleted
    const user = await this.usersService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Optionally: deny access if user is disabled
    // if (user.status === 'disabled') throw new UnauthorizedException('Account disabled');

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }
}
