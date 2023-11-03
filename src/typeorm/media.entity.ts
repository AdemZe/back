import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Actuality } from './actuality.entity';
import { User } from './user.entity';
import { MediaDTO } from 'src/media/dto/media.dto';

@Entity()
export class Media {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  idM: number;

  @Column({
    nullable: false,
    default: '',
  })
  url: string;

  @Column({
    nullable: false,
    default: '',
  })
  type: string;

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

  @ManyToOne(() => Actuality, (actuality) => actuality.medias, {
    onDelete: 'SET NULL',
  })
  actuality: Actuality;

  @ManyToOne(() => User, (user) => user.medias, { onDelete: 'CASCADE' })
  owner: User;

  @OneToOne(() => User, (user) => user.profilePicture, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  toDto() {
    return new MediaDTO(this);
  }
}
