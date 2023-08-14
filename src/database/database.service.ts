import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from './repository/favoritesRepository';

@Injectable()
export class DatabaseService {
  favorites = new FavoritesRepository();
}
