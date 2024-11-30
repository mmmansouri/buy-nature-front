import { ItemInCart } from "./order.item.model";

export interface Cart {
  id: string;
  itemInCart: ItemInCart[]
}
