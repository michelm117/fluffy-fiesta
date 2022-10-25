import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { JwtPayloadInterface } from '@fluffy-fiesta/interfaces';

/**
 * JwtStrategy is used to verify if the request has an valid access token.
 * PassportStrategy first verifies the JWT's signature. The validate() method is
 * only called if the token is valid (not expired and signed with our secret).
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor extracts the access token from the cookie and injects the
   * needed providers.
   * @param {ConfigService} configService
   * @param {UsersService} userService
   */
  constructor(
    private readonly userService: UsersService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
      /**
       * Enables the request as a parameter in  validate(). If true validate()
       * should look like this: validate(request: Request, payload: JwtPayload)
       */
      passReqToCallback: false,
    });
  }

  /**
   * We simply return the authenticated user. Because only we can sign the
   * access token, we have the guarantee that the information in payload are
   * correct and have not been modified. This is true as long as the secret has
   * not been leaked.
   *
   * It's also worth pointing out that this approach leaves us room ('hooks' as
   * it were) to inject other business logic into the process. For example, we
   * could do a database lookup in our validate() method to extract more
   * information about the user, resulting in a more enriched user object being
   * available in our Request. This is also the place we may decide to do
   * further token validation, such as looking up the userId in a list of
   * revoked tokens, enabling us to perform token revocation. The model we've
   * implemented here in our sample code is a fast, "stateless JWT" model, where
   * each API call is immediately authorized based on the presence of a valid
   * JWT, and a small bit of information about the requester (its userId and
   * username) is available in our Request pipeline.
   *
   * ToDo: Uncomment `isActive` when user can activate account following
   * link in registration email
   *
   * @param {TokenPayload} payload
   * @returns Promise<User>
   */
  async validate(payload: JwtPayloadInterface): Promise<User> {
    const user = await this.userService.findOneById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User is unauthorized');
    }
    // if (!user.isActive) {
    //   throw new UnauthorizedException('User is not active');
    // }
    return user;
  }
}
