import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateArtistDto): Artist {
    const id = uuidv4();
    const newArtist: Artist = { id, ...dto };

    this.databaseService.artists.create(id, newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.databaseService.artists.getAll();
  }

  findOne(id: string): Artist {
    if (!this.databaseService.artists.isExist(id)) {
      throw new NotFoundException(`Artist ${id} not found`);
    }
    return this.databaseService.artists.getOne(id);
  }

  update(id: string, dto: UpdateArtistDto): Artist {
    const artist = this.findOne(id);
    const updatedArtist = { ...artist, ...dto };

    this.databaseService.artists.create(id, updatedArtist);
    return updatedArtist;
  }

  remove(id: string): void {
    if (!this.databaseService.artists.isExist(id)) {
      throw new NotFoundException(`Artist ${id} not found`);
    }
    this.databaseService.artists.remove(id);
    this.removeArtistById(id);
  }

  removeArtistById(artistId: string) {
    const albums = this.databaseService.albums.getAll();
    albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });

    const tracks = this.databaseService.tracks.getAll();
    tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }
}
