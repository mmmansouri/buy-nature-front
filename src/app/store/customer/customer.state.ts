import { Customer } from "../../models/customer.model";

export interface CustomerState {
  customer: Customer;
  customerId: string | null; // Store customerId separately for creation flow
  loading: boolean;
  error: any;
}

export const initialState: CustomerState = {
  customer: {} as Customer,
  customerId: null,
  loading: false,
  error: null
};
