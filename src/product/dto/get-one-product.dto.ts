import { IsUUID } from 'class-validator';

export class GetOneProductParamDto {
  @IsUUID()
  id: string;
}
