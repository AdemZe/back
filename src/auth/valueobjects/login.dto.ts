import { ApiProperty } from '@nestjs/swagger';

export class LoginVO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
