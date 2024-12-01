import { OrderItem } from "../../models/order.item.model";

export interface CartState {
  orderItems: OrderItem[]; // Define your item model
}

export const initialCartState: CartState = {
  orderItems: []
};
