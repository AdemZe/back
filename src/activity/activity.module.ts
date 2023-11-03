import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { Activity } from '../typeorm/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
