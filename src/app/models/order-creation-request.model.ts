import { ShippingAddress } from "./shipping-address.model";
import { UUID } from "node:crypto";

export interface OrderCreationRequest {
  customerId: string;
  orderItems: Map<UUID, number>;
  total: number;
  status: string;
  shippingAddress: ShippingAddress
}
