import { ItemInCart } from "./item.in.cart.model";

export interface Cart {
  id: string;
  itemInCart: ItemInCart[]
}
