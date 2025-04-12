import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber()
  quantity: number = 10;

  @IsString()
  category: string;
}
