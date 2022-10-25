import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtRefreshGuard checks if refresh token is valid by using the
 * jwt-refresh-token strategy.
 */
@Injectable()
export default class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}
