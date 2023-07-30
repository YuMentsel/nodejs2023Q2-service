import { Injectable } from '@nestjs/common';
import { Repository } from './repository/repository';
import { User } from '../user/entities/user.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';

@Injectable()
export class DatabaseService {
  users = new Repository<User>();
  tracks = new Repository<Track>();
  artists = new Repository<Artist>();
}
