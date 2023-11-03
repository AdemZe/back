import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actuality } from 'src/typeorm/actuality.entity';
import { Repository } from 'typeorm';
import { CreateactualityVO } from './valueobjects/actuality.vo';
import { ActualityDTO } from './dto/actuality.dto';
import { CommentService } from 'src/comment/comment.service';
import { User } from 'src/typeorm/user.entity';
import { CreatecommentVO } from 'src/comment/valueobjects/comment.vo';
import { ReactionService } from 'src/reaction/reaction.service';
import { CreateReactionVO } from 'src/reaction/valueobjects/reaction.vo';
import { MediaService } from '../media/media.service';
import { CreateMediaVO } from '../media/valueobjects/media.vo';
import { createWriteStream } from 'fs';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '../users/valueobjects/activity-type';

@Injectable()
export class ActualityService {
  constructor(
    @InjectRepository(Actuality)
    private readonly actualityRepository: Repository<Actuality>,
    private commentService: CommentService,
    private reactionService: ReactionService,
    private mediaService: MediaService,
    private activityService: ActivityService,
  ) {}

  async getActuality(): Promise<Array<ActualityDTO>> {
    return (
      await this.actualityRepository.find({
        relations: {
          reactions: true,
          medias: true,
          comments: { owner: { profilePicture: true } },
        },
        order: { created_at: 'DESC' },
      })
    ).map((actuality) => actuality.toDTO());
  }

  async createActuality(
    createActuality: CreateactualityVO,
    file: Express.Multer.File,
    owner: User,
  ) {
    const newActuality = this.actualityRepository.create({
      ...createActuality,
      medias: [],
    });
    const filePath = 'uploads/' + file.originalname;
    const media = await this.mediaService.createMedia(
      new CreateMediaVO(filePath, file.mimetype),
      owner,
    );
    newActuality.medias.push(media);
    const ws = createWriteStream(filePath);
    ws.write(file.buffer);
    ws.close();
    return this.actualityRepository.save(newActuality);
  }

  async updateActuality(
    postId: number,
    createActuality: CreateactualityVO,
    file: Express.Multer.File,
    owner: User,
  ) {
    const actuality = await this.actualityRepository.findOne({
      where: { idA: postId },
      relations: { medias: true },
    });

    if (file) {
      const filePath = 'uploads/' + file.originalname;
      const media = await this.mediaService.createMedia(
        new CreateMediaVO(filePath, file.mimetype),
        owner,
      );
      actuality.medias = [media];
      const ws = createWriteStream(filePath);
      ws.write(file.buffer);
      ws.close();
    }

    if (createActuality.text) {
      actuality.text = createActuality.text;
    }

    if (createActuality.title) {
      actuality.title = createActuality.title;
    }

    return this.actualityRepository.save(actuality);
  }

  async createActualityComment(
    id: any,
    user: User,
    createComment: CreatecommentVO,
  ) {
    const actuality = await this.actualityRepository.findOneBy({ idA: id });
    if (!actuality) {
      throw new NotFoundException();
    }
    await this.commentService.createComment(createComment, user, actuality);
    await this.activityService.createActivity(
      user,
      actuality,
      ActivityType.COMMENT,
    );
  }

  async createActualityReaction(
    id: any,
    user: User,
    createreaction: CreateReactionVO,
  ) {
    const actuality = await this.actualityRepository.findOne({
      where: { idA: id },
      relations: { comments: true, reactions: true },
    });
    if (!actuality) {
      throw new NotFoundException();
    }
    if (
      actuality.reactions.findIndex(
        (reaction) => reaction.owner.id == user.id,
      ) > -1
    ) {
      throw new ConflictException();
    }
    await this.reactionService.createReaction(createreaction, user, actuality);
    await this.activityService.createActivity(
      user,
      actuality,
      ActivityType.REACTION,
    );
  }

  async findActualityById(idA: number, user: User): Promise<ActualityDTO> {
    const actuality = await this.actualityRepository.findOne({
      where: { idA: idA },
      relations: {
        comments: { owner: { profilePicture: true } },
        reactions: true,
        medias: true,
      },
      order: {
        comments: { created_at: 'DESC' },
      },
    });
    await this.activityService.createActivity(
      user,
      actuality,
      ActivityType.ARTICLE_READ,
    );
    return new ActualityDTO(actuality);
  }

  async deleteActualityById(idA: number): Promise<void> {
    await this.actualityRepository.delete({ idA: idA });
  }
}
