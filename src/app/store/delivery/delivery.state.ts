import {ShippingAddress} from "../../models/shipping-address.model";

export interface DeliveryState {
  delivery: ShippingAddress
}

export const initialDeliveryState: DeliveryState = {
  delivery:{} as ShippingAddress,
};
