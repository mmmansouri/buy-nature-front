import { Order } from "./order.model";
import { ShippingAddress } from "./shipping-address.model";

export interface Customer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  streetNumber: string;
  street: string;
  city: string;
  region: string;
  postalCode: number;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  orders: Order[];
  deliveryAddresses: ShippingAddress[];
}
