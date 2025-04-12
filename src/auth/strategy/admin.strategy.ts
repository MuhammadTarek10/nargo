import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { user } from 'generated/prisma';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
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
  }): Promise<Partial<user>> {
    const user = await this.db.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
      },
    });

    if (!user) throw new NotFoundException('There is no User with this Id');

    if (user.role !== 'Admin')
      throw new UnauthorizedException('Must be admin to do this operation');

    return user;
  }
}
