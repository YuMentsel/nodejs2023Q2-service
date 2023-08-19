import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: dto,
    });
    return plainToClass(User, newUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => plainToClass(User, user));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    return plainToClass(User, user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const { oldPassword, newPassword } = dto;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Previous password is wrong');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { version: { increment: 1 }, password: newPassword },
    });

    return plainToClass(User, updatedUser);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`User ${id} not found`);
      }
      throw err;
    }
  }
}
