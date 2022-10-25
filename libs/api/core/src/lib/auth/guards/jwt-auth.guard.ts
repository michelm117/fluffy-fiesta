import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard checks if access token is valid by using the jwt strategy.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
