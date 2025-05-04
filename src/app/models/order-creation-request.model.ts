import { ShippingAddress } from "./shipping-address.model";
import {OrderItemRequest} from "./order-item-request.model";

export interface OrderCreationRequest {
  customerId: string;
  orderItems: OrderItemRequest[];
  total: number;
  shippingAddress: ShippingAddress
}
