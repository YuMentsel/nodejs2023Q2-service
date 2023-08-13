import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
