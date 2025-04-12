import { IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  quantity: number;
}
