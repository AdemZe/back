import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ActivityType } from '../users/valueobjects/activity-type';
import { Actuality } from './actuality.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

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

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @ManyToOne(() => User, (user) => user.activity, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Actuality, (actuality) => actuality.activity, {
    onDelete: 'CASCADE',
  })
  actuality: Actuality;
}
