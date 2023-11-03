import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/typeorm/comment.entity';
import { Repository } from 'typeorm';
import { CreatecommentVO } from './valueobjects/comment.vo';
import { CommentDTO } from './dto/comment.dto';
import { Actuality } from 'src/typeorm/actuality.entity';
import { User } from 'src/typeorm/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  getcomment() {
    throw new Error('Method not implemented.');
  }

  createComment(
    createCommentDto: CreatecommentVO,
    user: User,
    actuality: Actuality,
  ) {
    const newComment = this.commentRepository.create({
      ...createCommentDto,
      owner: user,
      actuality,
    });
    return this.commentRepository.save(newComment);
  }

  async findcommentById(idC: number): Promise<CommentDTO> {
    const comment = await this.commentRepository.findOneBy({ idC });
    return new CommentDTO(comment);
  }
}
