import { ForbiddenException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
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

  async signup({ password, login }: AuthDto): Promise<User> {
    const salt = await this.authConfigService.getSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    return await this.userService.create({ login, password: hashedPass });
  }

  async login({ login: uLogin, password }: AuthDto): Promise<Auth> {
    const user = await this.userService.findOneByLogin(uLogin);
    if (!user) throw new ForbiddenException('Incorrect login');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new ForbiddenException('Incorrect password');

    const { id: userId, login } = await this.userService.findOneByLogin(uLogin);

    const [accessToken, refreshToken] =
      await this.authConfigService.generateTokens({ userId, login });

    return plainToClass(Auth, { accessToken, refreshToken });
  }

  async refresh(dto: RefreshDto): Promise<Auth> {
    const payload = await this.authConfigService.verifyRefreshToken(
      dto.refreshToken,
    );
    const [accessToken, refreshToken] =
      await this.authConfigService.generateTokens(payload);

    return plainToClass(Auth, {
      accessToken,
      refreshToken,
    });
  }
}
