import { Order } from "../../models/order.model";
import {OrderCreationRequest} from "../../models/order-creation-request.model";

export interface OrderState {
    order: Order;
    orderCreationRequest: OrderCreationRequest
    error: any;
  }

  export const initialState: OrderState = {
    order: {} as Order,
    orderCreationRequest: {} as OrderCreationRequest,
    error: null
  };
