import { ItemInCart } from "../../models/item.in.cart.model";

export interface CartState {
  itemsInCart: ItemInCart[]; // Define your item model
}

export const initialCartState: CartState = {
  itemsInCart: []
};
