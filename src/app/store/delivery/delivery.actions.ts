import { createAction, props } from '@ngrx/store';

export const updateDeliveryDetails = createAction(
  '[Delivery] Update Details',
  props<{ details: any }>()
);
