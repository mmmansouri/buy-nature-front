import { createReducer, on } from '@ngrx/store';
import { addItem, removeItem, clearCart, loadCart } from './cart.actions';
import {ItemInCart} from "../../models/item.in.cart.model";
import {initialCartState} from "./cart.state";


export const cartReducer = createReducer(
  initialCartState,
  on(loadCart, (state, { cart }) => ({ ...state, itemsInCart: [...cart] })),
  on(addItem, (state, { itemInCart }) => {
    const existingItem = state.itemsInCart.find((cartItem) => cartItem.item.id === itemInCart.item.id);
    if (existingItem) {
      // Update quantity of existing item
      return {
        ...state,
        itemsInCart: state.itemsInCart.map((cartItem) =>
          cartItem.item.id === itemInCart.item.id
            ? { ...cartItem, quantity: cartItem.quantity + itemInCart.quantity }
            : cartItem
        ),
      };
    }

    // Add new item to the cart
    return { ...state, itemsInCart: [...state.itemsInCart,  itemInCart ] };
  }),
  on(removeItem, (state, { itemId }) => ({
    ...state,
    itemsInCart: state.itemsInCart.filter((cartItem) => cartItem.item.id !== itemId),
  })),
  on(clearCart, (state) => ({ ...state, items: [] }))
);
