import { ShippingAddress } from "./shipping-address.model";
import { OrderItem } from "./order.item.model";

/**
 * Order Model - Enhanced with timestamps and total
 * Matches backend OrderRetrievalResponse DTO
 */
export interface Order {
    id?: string;
    customerId: string;
    status: string;
    paymentStatus: string;
    paymentIntent: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    total?: number;          // Total order amount
    createdAt?: string;      // ISO 8601 timestamp
    updatedAt?: string;      // ISO 8601 timestamp
  }
