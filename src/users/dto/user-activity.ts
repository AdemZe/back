import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '../../typeorm/activity.entity';
import { ActivityType } from '../valueobjects/activity-type';

export class UserActivity {
  @ApiProperty()
  comments: number;

  @ApiProperty()
  reactions: number;

  @ApiProperty()
  articles: number;

  constructor(userActivity: Activity[]) {
    this.comments = userActivity.filter(
      (activity) => activity.type === ActivityType.COMMENT,
    )?.length;
    this.reactions = userActivity.filter(
      (activity) => activity.type === ActivityType.REACTION,
    )?.length;
    this.articles = userActivity.filter(
      (activity) => activity.type === ActivityType.ARTICLE_READ,
    )?.length;
  }
}
