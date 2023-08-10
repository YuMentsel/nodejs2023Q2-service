import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
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
    const users = this.databaseService.users.getAll();
    return users.map((user) => plainToClass(User, user));
  }

  findOne(id: string): User {
    if (!this.databaseService.users.isExist(id)) {
      throw new NotFoundException(`User ${id} not found`);
    }
    const user = this.databaseService.users.getOne(id);
    return plainToClass(User, user);
  }

  update(id: string, dto: UpdateUserDto): User {
    const { oldPassword, newPassword } = dto;
    if (!this.databaseService.users.isExist(id)) {
      throw new NotFoundException(`User ${id} not found`);
    }
    const user = this.databaseService.users.getOne(id);

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
