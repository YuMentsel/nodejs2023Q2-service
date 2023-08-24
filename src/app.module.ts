import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CustomLoggingModule } from './logging/logging.module';
import { CustomLoggingMiddleware } from './logging/logging.middleware';
import { AuthConfigModule } from './auth-config/auth-config.module';
import { AuthConfigService } from './auth-config/auth-config.service';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoritesModule,
    CustomLoggingModule,
    DatabaseModule,
    AuthModule,
    AuthConfigModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, AuthConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomLoggingMiddleware).exclude('/doc').forRoutes('*');
  }
}
