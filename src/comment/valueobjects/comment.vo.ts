import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatecommentVO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  text: string;
}
