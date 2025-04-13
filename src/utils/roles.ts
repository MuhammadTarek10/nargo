import { user_roles } from 'generated/prisma';
import { Constants } from 'src/constants';

export function getRole(role: string): user_roles {
  switch (role.toUpperCase()) {
    case Constants.customer:
      return user_roles.Customer;
    case Constants.admin:
      return user_roles.Admin;
    default:
      return user_roles.Customer;
  }
}
