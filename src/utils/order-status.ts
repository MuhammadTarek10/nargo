import { order_status } from 'generated/prisma';

export function getStatus(status: string): order_status {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return order_status.PENDING;
    case 'SHIPPED':
      return order_status.SHIPPED;
    case 'DELIVERED':
      return order_status.DELIVERED;
    case 'CANCELED':
      return order_status.CANCELED;
    case 'PROCESSING':
      return order_status.PROCESSING;
    default:
      return order_status.PENDING;
  }
}
