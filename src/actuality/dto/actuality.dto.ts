import { ApiProperty } from '@nestjs/swagger';
import { CommentDTO } from 'src/comment/dto/comment.dto';
import { MediaDTO } from 'src/media/dto/media.dto';
import { ReactionDTO } from 'src/reaction/dto/reaction.dto';
import { Actuality } from 'src/typeorm/actuality.entity';
import { ActivityType } from '../../users/valueobjects/activity-type';

export class ActualityDTO {
  @ApiProperty()
  idA: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  views: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  comments: CommentDTO[];

  @ApiProperty()
  reactions: ReactionDTO[];

  @ApiProperty()
  medias: MediaDTO[];

  image_url: string;

  constructor(actuality: Actuality) {
    this.idA = actuality.idA;
    this.title = actuality.title;
    this.text = actuality.text;
    this.views = actuality.activity?.filter(
      (activity) => activity.type === ActivityType.ARTICLE_READ,
    )?.length;
    this.comments = actuality.comments?.map((comment) => comment.toDto());
    this.reactions = actuality.reactions?.map((reaction) => reaction.toDto());
    this.medias = actuality.medias?.map((media) => media.toDto());
    this.created_at = actuality.created_at;
  }
}
