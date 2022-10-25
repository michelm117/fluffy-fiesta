import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserAbilityFactory } from '../ability/user-ability.factory';
import { ExtendedRequest } from '@fluffy-fiesta/interfaces';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly abilityFactory: UserAbilityFactory
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: ExtendedRequest) {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req: ExtendedRequest, @Param('id') id: string) {
    const user = await this.usersService.findOneById(+id);
    // const ability = this.abilityFactory.defineAbility(req.user);
    // ForbiddenError.from(ability).throwUnlessCan(Action.Read, user);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req: ExtendedRequest,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: ExtendedRequest, @Param('id') id: string) {
    const { user } = req;
    return this.usersService.remove(+id, user);
  }
}
