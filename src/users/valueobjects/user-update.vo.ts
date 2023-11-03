import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserVO {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @MinLength(3)
  lastName: string;
}
