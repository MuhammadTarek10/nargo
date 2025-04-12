import { order_status } from 'generated/prisma';

export function getStatus(status: string): order_status {
  switch (status.toLowerCase()) {
    case 'pending':
      return order_status.PENDING;
    case 'shipped':
      return order_status.SHIPPED;
    case 'delivered':
      return order_status.DELIVERED;
    case 'canceled':
      return order_status.CANCELED;
    case 'processing':
      return order_status.PROCESSING;
    default:
      return order_status.PENDING;
  }
}
