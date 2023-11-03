import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reaction } from './reaction.entity';
import { Media } from './media.entity';
import { Comment } from './comment.entity';
import { Role } from 'src/authorization/role.enum';
import { UserDTO } from '../users/dto/user.dto';
import { UserStatus } from '../users/valueobjects/user-status';
import { Activity } from './activity.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  username: string;

  @Column({
    nullable: true,
    default: '',
  })
  firstName: string;

  @Column({
    nullable: false,
    default: '',
  })
  lastName: string;

  @Column({
    name: 'email_address',
    nullable: false,
    default: '',
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToOne(() => Media, (media) => media.user, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'SET NULL',
  })
  profilePicture: Media;

  @OneToMany(() => Comment, (comment) => comment.owner, {
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.owner, {
    cascade: true,
  })
  reactions: Reaction[];

  @OneToMany(() => Media, (media) => media.owner, {
    eager: true,
    cascade: true,
  })
  medias: Media[];

  @OneToMany(() => Activity, (activity) => activity.user, {
    eager: true,
    cascade: true,
  })
  activity: Activity[];

  @Column({
    nullable: true,
    default: new Date(),
  })
  created_at: Date;

  toDto(full = false) {
    return new UserDTO(this, full);
  }
}
