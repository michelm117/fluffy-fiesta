import { UserInterface } from './user.interfaces';

export interface NoteInterface {
  id: number;
  created_at: Date;
  note: string;
  user: UserInterface;
}
