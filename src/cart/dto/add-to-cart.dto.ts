import { IsOptional, IsPositive, IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  product_id: string;

  @IsOptional()
  @IsPositive()
  quantity: number = 1;
}
