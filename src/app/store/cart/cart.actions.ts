import { createAction, props } from '@ngrx/store';
import {OrderItem} from "../../models/order.item.model";

export const addItem = createAction('[Cart] Add Item', props<{ itemInCart: OrderItem }>());
export const removeItem = createAction('[Cart] Remove Item', props<{ itemId: string }>());
export const clearCart = createAction('[Cart] Clear Cart');
export const loadCart = createAction(
  '[Cart] Load Cart',
  props<{ cart: OrderItem[] }>()
);
