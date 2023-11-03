import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Actuality } from './actuality.entity';
import { User } from './user.entity';
import { ReactionDTO } from 'src/reaction/dto/reaction.dto';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  idR: number;

  @Column({
    type: 'smallint',
  })
  type: number;

  @Column({
    default: new Date(),
  })
  created_at: Date;

  @Column({
    default: new Date(),
  })
  updated_at: Date;

  @ManyToOne(() => Actuality, (actuality) => actuality.reactions, {
    onDelete: 'CASCADE',
  })
  actuality: Actuality;

  @ManyToOne(() => User, (user) => user.reactions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  owner: User;

  toDto() {
    return new ReactionDTO(this);
  }
}
