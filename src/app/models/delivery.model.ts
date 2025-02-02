import {Address} from "./address.model";

export interface ShippingAddress {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  address: Address
}
