import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateactualityVO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  text: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
