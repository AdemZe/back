import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actuality } from 'src/typeorm/actuality.entity';
import { ActualityController } from './actuality.controller';
import { ActualityService } from './actuality.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommentModule } from 'src/comment/comment.module';
import { ReactionModule } from 'src/reaction/reaction.module';
import { MediaModule } from '../media/media.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actuality]),
    AuthModule,
    UsersModule,
    CommentModule,
    ReactionModule,
    MediaModule,
    ActivityModule,
  ],
  controllers: [ActualityController],
  providers: [ActualityService],
  exports: [ActualityService],
})
export class ActualityModule {}
