import { createAction, props } from '@ngrx/store';
import {Delivery} from "../../models/delivery.model";

export const updateDeliveryDetails = createAction(
  '[Delivery] Update Delivery Details',
  props<{ delivery: Delivery }>()
);
