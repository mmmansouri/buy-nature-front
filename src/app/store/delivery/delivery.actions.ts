import { createAction, props } from '@ngrx/store';
import {Delivery} from "../../models/delivery.model";

export const updateDeliveryDetails = createAction(
  '[Delivery] Update Delivery Details',
  props<{ delivery: Delivery }>()
);

export const clearDeliveryDetails = createAction('[Delivery] Clear Delivery Details');
