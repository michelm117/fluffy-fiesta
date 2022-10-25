import { CreateUserDtoInterface } from '@fluffy-fiesta/interfaces';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto implements CreateUserDtoInterface {
  @IsEmail()
  @MaxLength(20)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @MinLength(8)
  @MaxLength(80)
  @IsString()
  password: string;
}
