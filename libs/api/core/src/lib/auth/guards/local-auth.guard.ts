import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard checks if credentials are correct by using the local strategy.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
