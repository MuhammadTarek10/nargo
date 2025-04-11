import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'generated/prisma';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(
    config: ConfigService,
    private db: DbService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET')!,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<Partial<User>> {
    const user = await this.db.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) throw new NotFoundException('There is no User with this Id');

    return user;
  }
}
