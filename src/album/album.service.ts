import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../database/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAlbumDto): Promise<Album> {
    const newAlbum = await this.prisma.album.create({ data: dto });
    return plainToClass(Album, newAlbum);
  }

  async findAll(): Promise<Album[]> {
    const albums = await this.prisma.album.findMany();
    return albums.map((album) => plainToClass(Album, album));
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException(`Album ${id} not found`);

    return plainToClass(Album, album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException(`Album ${id} not found`);

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: dto,
    });

    return plainToClass(Album, updatedAlbum);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Album ${id} not found`);
      }
      throw err;
    }
  }
}
