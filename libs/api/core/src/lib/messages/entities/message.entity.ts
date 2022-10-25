import {
  MessageInterface,
  PublicUserInterface,
} from '@fluffy-fiesta/interfaces';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message implements MessageInterface {
  @PrimaryGeneratedColumn()
  id: number;

  username: string;

  clientId: string;

  @Column()
  date: string;

  @Column()
  text: string;
}
