import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Actuality } from './actuality.entity';
import { User } from './user.entity';
import { CommentDTO } from 'src/comment/dto/comment.dto';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  idC: number;

  @Column({
    nullable: false,
    default: '',
  })
  text: string;

  @Column({
    nullable: true,
    default: new Date(),
  })
  created_at: Date;

  @Column({
    nullable: true,
    default: new Date(),
  })
  updated_at: Date;

  @ManyToOne(() => Actuality, (actuality) => actuality.comments, {
    onDelete: 'CASCADE',
  })
  actuality: Actuality;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  owner: User;

  toDto() {
    return new CommentDTO(this);
  }
}
