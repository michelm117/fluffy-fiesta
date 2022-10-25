import { Injectable } from '@nestjs/common';
import {
  Action,
  Role,
  SurveyInterface,
  UserInterface,
} from '@snider/api-interfaces';
import { User } from '../users/entities/user.entity';
import {
  AbilityBuilder,
  AbilityClass,
  buildMongoQueryMatcher,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { $nor, nor } from '@ucast/mongo2js';
import { Survey } from '../surveys/entities/survey.entity';

export type Subjects = InferSubjects<typeof User | typeof Survey> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;
const conditionsMatcher = buildMongoQueryMatcher({ $nor }, { nor });

@Injectable()
export class UserAbilityFactory {
  defineAbility(user: User, survey: SurveyInterface) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      const userIsInSurvey =
        survey.users.filter((u) => u.id === user.id).length > 0 ? true : false;

      if (userIsInSurvey) {
        console.log();
      } else {
        console.log();
      }

      const role = Role.Admin;
      can(Action.Read, User);

      can(Action.Update, User);
      cannot(Action.Update, User, { id: { $ne: user.id } }).because(
        'User can only update there own user'
      );

      can(Action.Delete, User);
      cannot(Action.Delete, User, { id: { $ne: user.id } }).because(
        'User can only delete there own user'
      );
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher,
    });
  }
}
