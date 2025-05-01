import { Customer } from "../../models/customer.model";

export interface CustomerState {
  customer: Customer;
  loading: boolean;
  error: any;
}

export const initialState: CustomerState = {
  customer: {} as Customer,
  loading: false,
  error: null
};
