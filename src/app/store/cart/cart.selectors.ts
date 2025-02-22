import { createSelector, createFeatureSelector } from '@ngrx/store';
import {CartState} from "./cart.state";


export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.orderItems
);

export const selectCartTotalItems = createSelector(
  selectCartState,
  (state) => {
    // Create a Set of unique item IDs
    const uniqueItemIds = new Set(state.orderItems.map(cartItem => cartItem.item.id));

    // Return the count of unique IDs
    return uniqueItemIds.size;
  }
);

export const selectCartTotalPrice = createSelector(
  selectCartState,
  (state) => {
    const total = state.orderItems.reduce((total, cartItem) =>
      total + cartItem.item.price * cartItem.quantity, 0);
    return Math.round(total * 100) / 100;
  }
);
