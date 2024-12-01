import { OrderItem } from "./order.item.model";

export interface Cart {
  id: string;
  itemInCart: OrderItem[]
}
