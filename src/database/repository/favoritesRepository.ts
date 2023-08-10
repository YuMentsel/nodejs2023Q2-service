import { Favorites } from '../../favorites/entities/favorites.entity';

export class FavoritesRepository implements Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
  constructor() {
    this.artists = [];
    this.albums = [];
    this.tracks = [];
  }

  getAll(): Favorites {
    return {
      artists: this.artists,
      albums: this.albums,
      tracks: this.tracks,
    };
  }

  add(id: string, category: keyof Favorites): void {
    this[category].push(id);
  }

  remove(id: string, category: keyof Favorites): void {
    this[category] = this[category].filter((favId) => favId !== id);
  }

  isExist(id: string, category: keyof Favorites): boolean {
    return this[category].includes(id);
  }
}
