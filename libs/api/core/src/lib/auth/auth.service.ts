import { ConflictException, Injectable, Req } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  CreateJwtPayloadInterface,
  ExtendedRequest,
  UserInterface,
} from '@fluffy-fiesta/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findOneByEmail(
      createUserDto.email
    );
    if (userExists) {
      throw new ConflictException('User with given email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser;
  }

  async login(@Req() req: ExtendedRequest, user: UserInterface) {
    const accessToken = this.generateAccessToken(user.id);
    const refreshTokenCookie = await this.generateRefreshToken(user);
    // const dummyCookie = this.generateDummyCookie();

    req.res.setHeader('Set-Cookie', [refreshTokenCookie]);
    return { accessToken: accessToken };
  }

  generateAccessToken(id: number) {
    const payload: CreateJwtPayloadInterface = {
      userId: id,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
      )}s`,
    });

    return token;
  }

  /**
   * Creates Cookie with jwt refresh token.
   * ToDo: Fidel with Domain, HttpOnly and Path properties.
   * ToDo: Store hashed refresh token in db.
   * @param {number} id
   * @returns {string} cookie with refresh token.
   */
  async generateRefreshToken(user: UserInterface) {
    const payload: CreateJwtPayloadInterface = {
      userId: user.id,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
      )}s`,
    });

    // Save token in db
    // ToDo: change to redis db
    // ToDo: use secure cookie! - https://en.wikipedia.org/wiki/Secure_cookie
    const hashedRefreshToken = await bcrypt.hash(token, 10);
    await this.usersService.updateRefreshToken(
      user.id,
      hashedRefreshToken,
      user
    );

    const domain = 'localhost';
    const sameSite = 'lax';
    const path = '/';
    const maxAge = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
    const cookie = `Authentication=${token}; Max-Age=${maxAge}; Path=${path}; SameSite=${sameSite}; Domain=${domain}; HttpOnly; Secure`;
    return cookie;
  }
}
