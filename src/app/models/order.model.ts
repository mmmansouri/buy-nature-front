import { ShippingAddress } from "./shipping-address.model";
import { OrderItem } from "./order.item.model";

export interface Order {
    id: string;
    status: string;
    orderItems: OrderItem[]
    shippingAddress: ShippingAddress
  }