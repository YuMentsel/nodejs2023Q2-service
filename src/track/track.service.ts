import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../database/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTrackDto): Promise<Track> {
    const newTrack = await this.prisma.track.create({ data: dto });
    return plainToClass(Track, newTrack);
  }

  async findAll(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany();
    return tracks.map((track) => plainToClass(Track, track));
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(`Track ${id} not found`);

    return plainToClass(Track, track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(`Track ${id} not found`);

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: dto,
    });

    return plainToClass(Track, updatedTrack);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Track  ${id} not found`);
      }
      throw err;
    }
  }
}
