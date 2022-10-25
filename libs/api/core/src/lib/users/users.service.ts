import { ForbiddenError } from '@casl/ability';
import { Action, UserInterface } from '@fluffy-fiesta/interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAbilityFactory } from '../ability/user-ability.factory';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  /**
   * Inject needed provider.
   * @param {Repository<UserInterface>} usersRepository
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly abilityFactory: UserAbilityFactory
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  /**
   * Finds all user entities.
   * @returns {Promise<User[]>} users
   */
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  /**
   * Finds entity that matches given id.
   * @param {number} id
   * @throws {InternalServerErrorException} - when given id is undefined
   * @throws {EntityNotFoundError} - when entity was not found
   * @returns {Promise<User | null>} user
   */
  async findOneById(id: number): Promise<User | null> {
    if (!id && id !== 0) {
      throw new InternalServerErrorException('Id is undefined');
    }
    const user = await this.usersRepository.findOneByOrFail({
      id,
    });

    return user;
  }

  /**
   * Finds entity that matches given email.
   * @param {string} email
   * @throws {InternalServerErrorException} - when given email is undefined
   * @throws {EntityNotFoundError} - when entity was not found
   * @returns {Promise<User | null>} user
   */
  async findOneByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new InternalServerErrorException('Email is undefined');
    }
    return await this.usersRepository.findOneByOrFail({ email });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: UserInterface
  ) {
    const userToUpdate = await this.findOneById(id);
    if (!userToUpdate) {
      return;
    }

    const ability = this.abilityFactory.defineAbility(currentUser);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpdate);
    return await this.usersRepository.update({ id: id }, { ...updateUserDto });
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string,
    currentUser: UserInterface
  ) {
    const userToUpdate = await this.findOneById(id);
    if (!userToUpdate) {
      return;
    }

    const ability = this.abilityFactory.defineAbility(currentUser);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpdate);
    return await this.usersRepository.update(
      { id: id },
      { hashedRefreshToken: refreshToken }
    );
  }

  async remove(id: number, currentUser: UserInterface) {
    const userToDelete = await this.findOneById(id);

    const ability = this.abilityFactory.defineAbility(currentUser);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToDelete);

    return await this.usersRepository.remove(userToDelete);
  }
}
