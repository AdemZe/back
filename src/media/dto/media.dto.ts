import { ApiProperty } from '@nestjs/swagger';
import { Media } from 'src/typeorm/media.entity';

export class MediaDTO {
  @ApiProperty()
  idM: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(media: Media) {
    this.idM = media.idM;
    this.url = `http://localhost:${process.env.HTTP_PORT}/` + media.url;
    this.type = media.type;
    this.created_at = media.created_at;
    this.updated_at = media.updated_at;
  }
}
