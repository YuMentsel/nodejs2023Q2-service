import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
