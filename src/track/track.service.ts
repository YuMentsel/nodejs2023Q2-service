import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { DatabaseService } from '../database/database.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateTrackDto): Track {
    const id = uuidv4();
    const artistId = this.databaseService.artists.isExist(dto.artistId)
      ? dto.artistId
      : null;

    const albumId = this.databaseService.albums.isExist(dto.albumId)
      ? dto.albumId
      : null;

    const newTrack: Track = plainToClass(Track, {
      id,
      ...dto,
      artistId,
      albumId,
    });

    this.databaseService.tracks.create(id, newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return this.databaseService.tracks.getAll();
  }

  findOne(id: string): Track {
    if (!this.databaseService.tracks.isExist(id)) {
      throw new NotFoundException(`Track ${id} not found`);
    }
    return this.databaseService.tracks.getOne(id);
  }

  update(id: string, dto: UpdateTrackDto): Track {
    const track = this.findOne(id);
    const updatedTrack = plainToClass(Track, { ...track, ...dto });

    this.databaseService.tracks.create(id, updatedTrack);
    return updatedTrack;
  }

  remove(id: string): void {
    if (!this.databaseService.tracks.isExist(id)) {
      throw new NotFoundException(`Track ${id} not found`);
    }
    this.databaseService.tracks.remove(id);
    if (this.databaseService.favorites.isExist(id, 'tracks'))
      this.databaseService.favorites.remove(id, 'tracks');
  }
}
