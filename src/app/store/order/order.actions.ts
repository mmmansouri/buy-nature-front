import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';
import { OrderItem } from '../../models/order.item.model';
import {OrderCreationRequest} from "../../models/order-creation-request.model";
import {OrderCreationStateType} from "./oder.state";


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

export const confirmOrder = createAction(
  '[Order] Confirm Order',
  props<{ order: Order }>()
);

export const createOrder = createAction(
  '[Order] Create Or Update Order',
  props<{ orderCreationRequest: OrderCreationRequest }>()
);

export const createOrderSuccess = createAction(
  '[Order] Create Order Success',
  props<{ order: any }>()
);

export const orderPaymentCreated = createAction(
  '[Order] Order Payment Created',
  props<{ paymentIntent: string }>()
);

export const orderPaymentSuccess = createAction(
  '[Order] Order Payment Success',
  props<{ orderId: string }>()
);

export const orderPaymentFailure = createAction(
  '[Order] Order Payment Failure',
  props<{ orderId: string }>()
);

export const createOrderFailure = createAction(
  '[Order] Create Or Update Order Failure',
  props<{ error: any }>()
);

export const updateOrderItems = createAction('[Order] Update Order Items',
  props<{ orderItems: OrderItem[] }>()
);

export const updateOrderItem = createAction('[Order] Update Order Item',
  props<{ orderItem: OrderItem }>()
);

export const removeOrderItem = createAction('[Order] Remove Order Item',
  props<{ orderItemId: string }>()
);

export const clearOrder = createAction('[Order] Clear Order');

export const clearAfterSuccessfulOrderCreation = createAction(
  '[Order] Clear After Successful Order Creation'
);

export const createPaymentIntent = createAction(
  '[Order] Create Payment Intent',
  props<{ order: Order }>()
);

export const createPaymentIntentSuccess = createAction(
  '[Order] Create Payment Intent Success',
  props<{ clientSecret: string }>()
);

export const createPaymentIntentFailure = createAction(
  '[Order] Create Payment Intent Failure',
  props<{ error: any }>()
);
