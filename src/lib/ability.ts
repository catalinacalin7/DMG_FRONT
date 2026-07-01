import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export const AppAbility = createMongoAbility();
export type AppAbilityType = typeof AppAbility

type Permissions = {
  role: string;
  action: string;
  subject: string;
}

export const defineAbilityFor = (permissions: Permissions[]) => {
  const { can, rules } = new AbilityBuilder(createMongoAbility);

  permissions.forEach((perm) => {
    can(perm.action, perm.subject);
  });

  return createMongoAbility(rules);
};
