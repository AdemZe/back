import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../typeorm/comment.entity';
import { UserDTO } from '../../users/dto/user.dto';

export class CommentDTO {
  @ApiProperty()
  idC: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  owner: UserDTO;

  constructor(comment: Comment) {
    this.idC = comment.idC;
    this.text = comment.text;
    this.created_at = comment.created_at;
    this.owner = comment.owner.toDto();
  }
}
