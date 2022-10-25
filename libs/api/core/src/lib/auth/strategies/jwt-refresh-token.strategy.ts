import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { JwtPayloadInterface } from '@fluffy-fiesta/interfaces';

/**
 * JwtRefreshTokenStrategy is used to verify if the request has an valid refresh token.
 * PassportStrategy first verifies the JWT's signature. The validate() method is
 * only called if the token is valid (not expired and signed with our secret).
 */
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  /**
   * The constructor extracts the refresh token from the cookie and injects the
   * needed providers.
   * @param {ConfigService} configService
   * @param {UsersService} userService
   */
  constructor(
    private readonly userService: UsersService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request?.cookies?.Authentication;
          return refreshToken;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      /**
       * Enables the request as a parameter in  validate(). If true validate()
       * should look like this: validate(request: Request, payload: JwtPayload)
       */
      passReqToCallback: true,
    });
  }

  /**
   * Verify if the refresh token belongs to the user.
   *
   * Because of option passReqToCallback inside the constructor we have access
   * on the request.
   * @param request
   * @param payload
   * @returns { Promise<User> }
   */
  async validate(
    request: Request,
    payload: JwtPayloadInterface
  ): Promise<User> {
    const refreshToken = request.cookies?.Authentication;

    if (!refreshToken) {
      throw new UnauthorizedException('User is unauthorized');
    }

    const user = await this.userService.findOneById(payload.userId);

    if (!user) {
      throw new UnauthorizedException('User is unauthorized');
    }

    // ToDo: change to redis db
    const refreshTokenIsMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken
    );

    if (!refreshTokenIsMatching) {
      throw new UnauthorizedException('User is unauthorized');
    }

    return user;
  }
}
