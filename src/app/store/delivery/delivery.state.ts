import {Address} from "../../models/address.model";
import {Delivery} from "../../models/delivery.model";

export interface DeliveryState {
  delivery: Delivery
}

export const initialDeliveryState: DeliveryState = {
  delivery:{} as Delivery,
};
