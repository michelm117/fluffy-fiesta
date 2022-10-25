import { ForbiddenError } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserAbilityFactory } from '../user-ability.factory';
import { CHECK_ABILITY, RequiredRule } from '../decorators/abilities.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: UserAbilityFactory
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Parse the action and subject from the @CheckAbilities({ action, subject
    // }) decorator.
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.abilityFactory.defineAbility(user);

    rules.forEach((rule) => {
      ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
    });

    return true;
  }
}
