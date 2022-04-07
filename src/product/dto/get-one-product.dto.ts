import { IsUUID } from 'class-validator';

export class GetOneResourceParamDto {
  @IsUUID()
  id: string;
}
