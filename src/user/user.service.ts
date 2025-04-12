import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not Found');

    return await this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        first_name: dto.first_name ?? dto.first_name,
        last_name: dto.last_name ?? dto.last_name,
        email: dto.email ?? dto.email,
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
      },
    });
  }
}
