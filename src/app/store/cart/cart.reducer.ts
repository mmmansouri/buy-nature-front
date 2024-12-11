import { createReducer, on } from '@ngrx/store';
import { addItem, removeItem, clearCart, loadCart } from './cart.actions';
import {OrderItem} from "../../models/order.item.model";
import {initialCartState} from "./cart.state";
import e from 'express';


export const cartReducer = createReducer(
  initialCartState,
  on(loadCart, (state, { cart }) => ({ ...state, orderItems: [...cart] })),
  on(addItem, (state, { itemInCart }) => {

    const existingItem = state.orderItems.find((cartItem) => cartItem.item.id === itemInCart.item.id);
    
    if(existingItem && (itemInCart.quantity + existingItem!.quantity) <= 0 ) {  
      return {
        ...state,
        orderItems: state.orderItems.filter((cartItem) => cartItem.item.id !== itemInCart.item.id)      }
    }

    if (existingItem) {
      // Update quantity of existing item
      return {
        ...state,
        orderItems: state.orderItems.map((cartItem) =>
          cartItem.item.id === itemInCart.item.id
            ? { ...cartItem, quantity: cartItem.quantity + itemInCart.quantity }
            : cartItem
        ),
      };
    }

    // Add new item to the cart
    return { ...state, orderItems: [...state.orderItems,  itemInCart ] };
  }),
  on(removeItem, (state, { itemId }) => ({
    ...state,
    orderItems: state.orderItems.filter((cartItem) => cartItem.item.id !== itemId),
  })),
  on(clearCart, (state) => ({ ...state, orderItems: [] }))
);
