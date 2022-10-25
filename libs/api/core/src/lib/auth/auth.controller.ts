import {
  ExtendedRequest,
  PublicUserInterface,
} from '@fluffy-fiesta/interfaces';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import JwtRefreshGuard from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('register')
  async register(@Body() userDto: CreateUserDto): Promise<PublicUserInterface> {
    return this.authService.register(userDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: ExtendedRequest): Promise<{ accessToken: string }> {
    return this.authService.login(req, req.user);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: ExtendedRequest): { accessToken: string } {
    const user = req.user;
    const accessToken = this.authService.generateAccessToken(user.id);
    return { accessToken: accessToken };
  }
}
