import { Order } from "../../models/order.model";
import {OrderCreationRequest} from "../../models/order-creation-request.model";

export type OrderCreationStateType = 'loading' | 'success' | 'error';

export interface OrderState {
    order: Order;
    orderCreationRequest: OrderCreationRequest
    orderCreationState?: OrderCreationStateType;
    error: any;
  }

  export const initialState: OrderState = {
    order: {} as Order,
    orderCreationRequest: {} as OrderCreationRequest,
    orderCreationState: 'loading',
    error: null
  };
