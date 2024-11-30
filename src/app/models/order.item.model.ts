import {Item} from "./item.model";

export interface OrderItem {
  item: Item;        // The item being added to the cart
  quantity: number;  // The quantity of the item in the cart
}
