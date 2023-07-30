import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateUserDto): User {
    const id = uuidv4();
    const newUser: User = {
      id,
      ...dto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.databaseService.users.create(id, newUser);
    return plainToClass(User, newUser);
  }

  findAll(): User[] {
    return this.databaseService.users.getAll();
  }

  findOne(id: string): User {
    if (!this.databaseService.users.isExist(id)) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return this.databaseService.users.getOne(id);
  }

  update(id: string, dto: UpdateUserDto): User {
    const { oldPassword, newPassword } = dto;
    const user = this.findOne(id);

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Previous password is wrong');
    }

    const updatedUser = {
      ...user,
      password: newPassword,
      updatedAt: Date.now(),
      version: user.version + 1,
    };

    this.databaseService.users.create(id, updatedUser);
    return plainToClass(User, updatedUser);
  }

  remove(id: string): void {
    if (!this.databaseService.users.isExist(id)) {
      throw new NotFoundException(`User ${id} not found`);
    }
    this.databaseService.users.remove(id);
  }
}
