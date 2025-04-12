import { user_roles } from 'generated/prisma';

export function getRole(role: string): user_roles {
  switch (role) {
    case 'Customer':
      return user_roles.Customer;
    case 'Admin':
      return user_roles.Admin;
    default:
      return user_roles.Customer;
  }
}
