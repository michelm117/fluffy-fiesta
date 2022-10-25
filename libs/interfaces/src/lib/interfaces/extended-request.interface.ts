import { Request } from 'express';
import { UserInterface } from './user.interfaces';

export interface ExtendedRequest extends Request {
  user: UserInterface;
}
