import { IsEmail, IsNumber } from 'class-validator';

export class PaystackDto {
  @IsEmail()
  email: string;

  @IsNumber()
  amount: number;
}
