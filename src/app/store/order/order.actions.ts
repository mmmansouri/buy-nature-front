import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';
import { OrderItem } from '../../models/order.item.model';


export const getOrders = createAction('[Order] Get Orders');

export const getOrdersSuccess = createAction(
  '[Order] Get Orders Success',
  props<{ orders: Order[] }>()
);

export const getOrdersFailure = createAction(
  '[Order] Get Orders Failure',
  props<{ error: any }>()
);

export const getOrderById = createAction(
  '[Order] Get Order By Id',
  props<{ id: string }>()
);

export const getOrderByIdSuccess = createAction(
  '[Order] Get Order By Id Success',
  props<{ order: Order }>()
);

export const getOrderByIdFailure = createAction(
  '[Order] Get Order By Id Failure',
  props<{ error: any }>()
);

export const createOrUpdateOrder = createAction(
  '[Order] Create Or Update Order',
  props<{ order: Order }>()
);

export const createOrUpdateOrderFailure = createAction(
  '[Order] Create Or Update Order Failure',
  props<{ error: any }>()
);

export const updateOrderItems = createAction('[Order] Update Order Items',
  props<{ orderItems: OrderItem[] }>()
);

export const updateOrderItem = createAction('[Order] Update Order Item',
  props<{ orderItem: OrderItem }>()
);