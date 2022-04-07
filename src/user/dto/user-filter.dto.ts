import { IsOptional } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  search: string;

  @IsOptional()
  role: string;
}
