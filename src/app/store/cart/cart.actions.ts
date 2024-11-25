import { createAction, props } from '@ngrx/store';
import {ItemInCart} from "../../models/item.in.cart.model";

export const addItem = createAction('[Cart] Add Item', props<{ itemInCart: ItemInCart }>());
export const removeItem = createAction('[Cart] Remove Item', props<{ itemId: string }>());
export const clearCart = createAction('[Cart] Clear Cart');
export const loadCart = createAction(
  '[Cart] Load Cart',
  props<{ cart: ItemInCart[] }>()
);
