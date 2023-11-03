import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateMediaVO {
  @IsNotEmpty()
  @MinLength(10)
  url: string;

  @IsNotEmpty()
  @MinLength(8)
  type: string;

  constructor(url: string, type: string) {
    this.url = url;
    this.type = type;
  }
}
