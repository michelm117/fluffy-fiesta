import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserAbilityFactory } from './ability/user-ability.factory';
import { MessagesModule } from './messages/messages.module';
import { MessagesGateway } from './messages/messages.gateway';

@Module({
  imports: [AuthModule, UsersModule, MessagesModule],
  controllers: [],
  providers: [UserAbilityFactory, MessagesGateway],
  exports: [UsersModule, UserAbilityFactory, MessagesModule],
})
export class ApiCoreModule {}
