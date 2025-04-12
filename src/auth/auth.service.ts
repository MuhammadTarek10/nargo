import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { DbService } from 'src/db/db.service';
import { getRole } from 'src/utils/roles';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private db: DbService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ access_token: string } | undefined> {
    const existingUser = await this.db.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) throw new BadRequestException('Email already used');

    const hash = await argon.hash(dto.password);
    try {
      const user = await this.db.user.create({
        data: {
          email: dto.email,
          first_name: dto.first_name,
          last_name: dto.last_name,
          hash: hash,
          role: getRole(dto.role),
        },
      });

      return await this.generateToken(user.id, user.email, user.role);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.db.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('Invalid Credentials');

    const passwordMatches = await argon.verify(user.hash, dto.password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    return await this.generateToken(user.id, user.email, user.role);
  }

  private async generateToken(
    id: string,
    email: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: id,
      email: email,
      role: role,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    return { access_token: token };
  }
}
