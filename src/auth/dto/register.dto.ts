import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Constants } from 'src/constants';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  role: string = Constants.customer;
}
