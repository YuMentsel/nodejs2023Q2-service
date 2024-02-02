import { Module } from '@nestjs/common';
import { AuthConfigService } from './auth-config.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [AuthConfigService],
  exports: [AuthConfigService, JwtModule],
})
export class AuthConfigModule {}
