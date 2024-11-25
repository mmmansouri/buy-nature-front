import {Address} from "../../models/address.model";

export interface DeliveryState {
  details: {
    firstname: string;
    lastname: string;
    email: string;
    address: Address
  };
}

export const initialDeliveryState: DeliveryState = {
  details: {
    firstname: '',
    lastname: '',
    email: '',
    address: {
      street: '',
      number: '',
      region: '',
      country: '',
    },
  },
};
