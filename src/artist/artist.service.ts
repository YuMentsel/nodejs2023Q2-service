import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../database/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    const newArtist = await this.prisma.artist.create({ data: dto });
    return plainToClass(Artist, newArtist);
  }

  async findAll(): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany();
    return artists.map((artist) => plainToClass(Artist, artist));
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist ${id} not found`);

    return plainToClass(Artist, artist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist ${id} not found`);

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: dto,
    });

    return plainToClass(Artist, updatedArtist);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.artist.delete({ where: { id } });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Artist  ${id} not found`);
      }
      throw err;
    }
  }
}
