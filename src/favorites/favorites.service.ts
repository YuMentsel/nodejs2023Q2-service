import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { FavoritesResponseDto } from './dto/response-favorites.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FavoritesResponseDto> {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({ select: { artist: true } }),
      this.prisma.favoriteAlbum.findMany({ select: { album: true } }),
      this.prisma.favoriteTrack.findMany({ select: { track: true } }),
    ]);

    return {
      artists: artists.map(({ artist }) => artist),
      albums: albums.map(({ album }) => album),
      tracks: tracks.map(({ track }) => track),
    };
  }

  async addAlbum(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.favoriteAlbum.create({ data: { albumId: id } });
      return { message: 'Add album to the favorites' };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new UnprocessableEntityException(`Album with ${id} not found`);
        }
        if (err.code === 'P2002') {
          return { message: 'Album already exist in favorites' };
        }
      }
      throw err;
    }
  }

  async addArtist(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.favoriteArtist.create({ data: { artistId: id } });
      return { message: 'Add artist to the favorites' };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new UnprocessableEntityException(`Artist with ${id} not found`);
        }
        if (err.code === 'P2002') {
          return { message: 'Artist already exist in favorites' };
        }
      }
      throw err;
    }
  }

  async addTrack(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.favoriteTrack.create({
        data: { trackId: id },
      });
      return { message: 'Add track to the favorites' };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new UnprocessableEntityException(`Track with ${id} not found`);
        }
        if (err.code === 'P2002') {
          return { message: 'Track already exist in favorites' };
        }
      }
      throw err;
    }
  }

  async removeAlbum(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.favoriteAlbum.delete({ where: { albumId: id } });
      return { message: 'Remove album from the favorites' };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Album with ${id} not found`);
      }
      throw err;
    }
  }

  async removeArtist(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.favoriteArtist.delete({ where: { artistId: id } });
      return { message: 'Remove artist from the favorites' };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Artist with ${id} not found`);
      }
      throw err;
    }
  }

  async removeTrack(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.favoriteTrack.delete({ where: { trackId: id } });
      return { message: 'Remove track from the favorites' };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Track with ${id} not found`);
      }
      throw err;
    }
  }
}
