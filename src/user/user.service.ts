import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { getRole } from 'src/utils/roles';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  async update(user_id: string, dto: UpdateUserDto) {
    const user = await this.db.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) throw new NotFoundException('User not Found');

    return await this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        first_name: dto.first_name ?? user.first_name,
        last_name: dto.last_name ?? user.last_name,
        email: dto.email ?? user.email,
        role: dto.role ? getRole(dto.role) : user.role,
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        role: true,
      },
    });
  }
}
