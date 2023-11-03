import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from 'src/typeorm/reaction.entity';
import { Repository } from 'typeorm';
import { CreateReactionVO } from './valueobjects/reaction.vo';
import { ReactionDTO } from './dto/reaction.dto';
import { User } from '../typeorm/user.entity';
import { Actuality } from '../typeorm/actuality.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  getreaction() {
    throw new Error('Method not implemented.');
  }

  async createReaction(
    createReactionDto: CreateReactionVO,
    user: User,
    actuality: Actuality,
  ) {
    const newReaction = await this.reactionRepository.create({
      ...createReactionDto,
      owner: user,
      actuality,
    });
    return this.reactionRepository.save(newReaction);
  }

  async findReactionById(idR: number): Promise<ReactionDTO> {
    const reaction = await this.reactionRepository.findOneBy({ idR });
    return new ReactionDTO(reaction);
  }
}
