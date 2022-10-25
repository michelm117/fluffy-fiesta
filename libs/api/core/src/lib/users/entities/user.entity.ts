import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Note } from '../../notes/entities/note.entity';

/**
 * User class representing a user entity.
 */
@Entity()
export class User {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ default: false })
  isAdmin: boolean;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({ default: false })
  isActive: boolean;

  @Exclude()
  @Column({ nullable: true })
  hashedRefreshToken: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
