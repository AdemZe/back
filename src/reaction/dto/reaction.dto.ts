import { ApiProperty } from '@nestjs/swagger';
import { Reaction } from 'src/typeorm/reaction.entity';
import {UserDTO} from "../../users/dto/user.dto";

export class ReactionDTO {
  @ApiProperty()
  idR: number;

  @ApiProperty()
  type: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  owner: UserDTO;

  constructor(reaction: Reaction) {
    this.idR = reaction.idR;
    this.type = reaction.type;
    this.created_at = reaction.created_at;
    this.updated_at = reaction.updated_at;
    this.owner = reaction.owner.toDto();
  }
}
