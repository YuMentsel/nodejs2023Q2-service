import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
