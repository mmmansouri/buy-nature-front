import { Order } from "../../models/order.model";

export interface OrderState {
    order: Order;
    error: any;
  }
  
  export const initialState: OrderState = {
    order: {} as Order,
    error: null
  };
  