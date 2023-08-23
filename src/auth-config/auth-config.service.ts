import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class AuthConfigService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: TokenPayloadDto): Promise<string[]> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY', 'secret123123'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME', '1h'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(
        'JWT_SECRET_REFRESH_KEY',
        'secret123123',
      ),
      expiresIn: this.configService.get<string>(
        'TOKEN_REFRESH_EXPIRE_TIME',
        '24h',
      ),
    });

    return [accessToken, refreshToken];
  }

  async verifyAccessToken(token: string): Promise<TokenPayloadDto> {
    const { userId, login } =
      await this.jwtService.verifyAsync<TokenPayloadDto>(token, {
        secret: this.configService.get<string>(
          'JWT_SECRET_KEY',
          'secret123123',
        ),
      });
    return { userId, login };
  }

  async verifyRefreshToken(token: string): Promise<TokenPayloadDto> {
    const { userId, login } =
      await this.jwtService.verifyAsync<TokenPayloadDto>(token, {
        secret: this.configService.get<string>(
          'JWT_SECRET_REFRESH_KEY',
          'secret123123',
        ),
      });
    return { userId, login };
  }
}
