import { createAction, props } from '@ngrx/store';
import {ShippingAddress} from "../../models/shipping-address.model";

export const updateDeliveryDetails = createAction(
  '[Delivery] Update Delivery Details',
  props<{ delivery: ShippingAddress }>()
);

export const clearDeliveryDetails = createAction('[Delivery] Clear Delivery Details');
