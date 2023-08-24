import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from './entity/auth.entity';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { RefreshDto } from './dto/refresh.dto';
import { AuthDto } from './dto/auth.dto';
import { Public } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  async signup(@Body() dto: AuthDto): Promise<User> {
    return await this.authService.signup(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto): Promise<Auth> {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto): Promise<Auth> {
    return await this.authService.refresh(dto);
  }
}
