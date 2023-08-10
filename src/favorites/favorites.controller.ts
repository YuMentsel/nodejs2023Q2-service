import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponseDto } from './dto/response-favorites.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(): FavoritesResponseDto {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.add(id, 'tracks');
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.remove(id, 'tracks');
  }

  @Post('album/:id')
  addAlbum(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.add(id, 'albums');
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.remove(id, 'albums');
  }

  @Post('artist/:id')
  addArtist(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.add(id, 'artists');
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.remove(id, 'artists');
  }
}
