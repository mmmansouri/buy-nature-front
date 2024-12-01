import {Address} from "./address.model";

export interface Delivery {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  address: Address
}
