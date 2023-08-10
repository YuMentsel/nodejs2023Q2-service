import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
