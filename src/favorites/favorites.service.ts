import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Favorites } from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    const favorites = this.databaseService.favorites.getAll();

    const artists = favorites.artists.map((id) =>
      this.databaseService.artists.getOne(id),
    );

    const albums = favorites.albums.map((id) =>
      this.databaseService.albums.getOne(id),
    );

    const tracks = favorites.tracks.map((id) =>
      this.databaseService.tracks.getOne(id),
    );

    return { artists, albums, tracks };
  }

  add(id: string, category: keyof Favorites) {
    if (!this.databaseService[category].isExist(id)) {
      throw new UnprocessableEntityException(
        `Oops, ${category} ${id} not found`,
      );
    }
    return this.databaseService.favorites.add(id, category);
  }

  remove(id: string, category: keyof Favorites): void {
    if (!this.databaseService.favorites.isExist(id, category)) {
      throw new NotFoundException(`Oops, ${category} ${id} not found`);
    }
    return this.databaseService.favorites.remove(id, category);
  }
}
