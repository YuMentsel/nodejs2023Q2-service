import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateTrackDto): Track {
    const id = uuidv4();
    const newTrack: Track = {
      id,
      ...dto,
      artistId: null,
      albumId: null,
    };

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
    const updatedTrack = { ...track, ...dto };

    this.databaseService.tracks.create(id, updatedTrack);
    return updatedTrack;
  }

  remove(id: string): void {
    if (!this.databaseService.tracks.isExist(id)) {
      throw new NotFoundException(`Track ${id} not found`);
    }
    this.databaseService.tracks.remove(id);
  }
}
