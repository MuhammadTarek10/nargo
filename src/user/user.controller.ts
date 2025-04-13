import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { user } from 'generated/prisma';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get('me')
  getMe(@GetUser() user: user) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') user_id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(user_id, dto);
  }
}
