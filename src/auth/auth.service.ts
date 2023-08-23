import { ForbiddenException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth } from './entity/auth.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RefreshDto } from './dto/refresh.dto';
import { AuthConfigService } from '../auth-config/auth-config.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authConfigService: AuthConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<User> {
    return await this.userService.create(dto);
  }

  async login({ login: uLogin, password }: AuthDto): Promise<Auth> {
    const isValidPassword = await this.userService.isValidPassword(
      uLogin,
      password,
    );
    if (!isValidPassword)
      throw new ForbiddenException('Incorrect login or password');

    const { id: userId, login } = await this.userService.findOneByLogin(uLogin);

    const [accessToken, refreshToken] =
      await this.authConfigService.generateTokens({ userId, login });

    return plainToInstance(Auth, { accessToken, refreshToken });
  }

  async refresh(dto: RefreshDto): Promise<Auth> {
    const payload = await this.authConfigService.verifyRefreshToken(
      dto.refreshToken,
    );
    const [accessToken, refreshToken] =
      await this.authConfigService.generateTokens(payload);

    return plainToInstance(Auth, {
      accessToken,
      refreshToken,
    });
  }
}
