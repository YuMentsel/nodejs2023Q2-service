import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Repository } from './repository/repository';

@Injectable()
export class DatabaseService {
  users = new Repository<User>();
}
