import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  artistId: string | null;
}
