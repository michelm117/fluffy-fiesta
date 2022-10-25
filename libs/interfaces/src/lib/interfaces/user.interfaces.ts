import { NoteInterface } from './note.interface';

export interface PublicUserInterface {
  email: string;
  username: string;
}

export interface UserInterface extends PublicUserInterface {
  id: number;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  hashedRefreshToken: string;
  notes: NoteInterface[];
}

export interface CreateUserDtoInterface extends Partial<PublicUserInterface> {
  password: string;
}
