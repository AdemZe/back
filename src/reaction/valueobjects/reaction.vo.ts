import { IsNotEmpty } from 'class-validator';

export class CreateReactionVO {
  @IsNotEmpty()
  type: number;
}
