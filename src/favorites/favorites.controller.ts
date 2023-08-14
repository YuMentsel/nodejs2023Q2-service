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
  constructor(
    private readonly favoritesService: FavoritesService, // private readonly trackService: TrackService, // private readonly albumService: AlbumService, // private readonly artistService: ArtistService,
  ) {}

  @Get()
  async findAll(): Promise<FavoritesResponseDto> {
    return await this.favoritesService.findAll();
  }

  @Post('album/:id')
  async addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.favoritesService.addAlbum(id);
  }

  @Post('artist/:id')
  async addArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return await this.favoritesService.addArtist(id);
  }

  @Post('track/:id')
  async addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.favoritesService.addTrack(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.favoritesService.removeAlbum(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.favoritesService.removeArtist(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.favoritesService.removeTrack(id);
  }
}
