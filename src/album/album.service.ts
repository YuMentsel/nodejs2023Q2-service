import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { DatabaseService } from '../database/database.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateAlbumDto): Album {
    const id = uuidv4();
    const newAlbum: Album = plainToClass(Album, { artistId: null, id, ...dto });

    this.databaseService.albums.create(id, newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.databaseService.albums.getAll();
  }

  findOne(id: string): Album {
    if (!this.databaseService.albums.isExist(id)) {
      throw new NotFoundException(`Album ${id} not found`);
    }
    return this.databaseService.albums.getOne(id);
  }

  update(id: string, dto: UpdateAlbumDto): Album {
    const album = this.findOne(id);
    const updatedAlbum = plainToClass(Album, { ...album, ...dto });

    this.databaseService.albums.create(id, updatedAlbum);
    return updatedAlbum;
  }

  remove(id: string): void {
    if (!this.databaseService.albums.isExist(id)) {
      throw new NotFoundException(`Album ${id} not found`);
    }
    this.databaseService.albums.remove(id);
    this.removeAlbumById(id);
    if (this.databaseService.favorites.isExist(id, 'albums'))
      this.databaseService.favorites.remove(id, 'albums');
  }

  removeAlbumById(albumId: string) {
    const tracks = this.databaseService.tracks.getAll();
    tracks.forEach((track) => {
      if (track.albumId === albumId) {
        this.databaseService.tracks.create(track.id, {
          ...track,
          albumId: null,
        });
      }
    });
  }
}