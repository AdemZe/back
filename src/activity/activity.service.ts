import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actuality } from 'src/typeorm/actuality.entity';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/user.entity';
import { Activity } from '../typeorm/activity.entity';
import { ActivityType } from '../users/valueobjects/activity-type';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async createActivity(
    owner: User,
    actuality: Actuality,
    activityType: ActivityType,
  ) {
    const activity = this.activityRepository.create({
      user: owner,
      actuality,
      type: activityType,
    });
    return this.activityRepository.save(activity);
  }
}
