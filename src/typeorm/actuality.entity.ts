import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { Reaction } from './reaction.entity';
import { Media } from './media.entity';
import { ActualityDTO } from 'src/actuality/dto/actuality.dto';
import { Activity } from './activity.entity';

@Entity()
export class Actuality {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  idA: number;

  @Column({
    nullable: false,
    default: '',
  })
  title: string;

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

  @OneToMany(() => Comment, (comment) => comment.actuality)
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.actuality)
  reactions: Reaction[];

  @OneToMany(() => Media, (media) => media.actuality, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  medias: Media[];

  @OneToMany(() => Activity, (activity) => activity.actuality)
  activity: Activity[];

  toDTO() {
    return new ActualityDTO(this);
  }
}
