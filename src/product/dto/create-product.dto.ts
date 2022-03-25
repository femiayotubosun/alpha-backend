import { IsNotEmpty, IsDecimal, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  stock: number;
}
