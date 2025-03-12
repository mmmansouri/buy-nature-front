import { ShippingAddress } from "./shipping-address.model";
import { UUID } from "node:crypto";

export interface OrderCreationRequest {
  customerId: string;
  orderItems: Record<string, number>;
  total: number;
  status: string;
  shippingAddress: ShippingAddress
}
