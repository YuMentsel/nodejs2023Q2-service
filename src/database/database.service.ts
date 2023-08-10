import { Injectable } from '@nestjs/common';
import { Repository } from './repository/repository';
import { User } from '../user/entities/user.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { FavoritesRepository } from './repository/favoritesRepository';

@Injectable()
export class DatabaseService {
  users = new Repository<User>();
  tracks = new Repository<Track>();
  artists = new Repository<Artist>();
  albums = new Repository<Album>();
  favorites = new FavoritesRepository();
}
