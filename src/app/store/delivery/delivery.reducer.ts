import { createReducer, on } from '@ngrx/store';
import { clearDeliveryDetails, updateDeliveryDetails } from './delivery.actions';
import { DeliveryState, initialDeliveryState } from './delivery.state';

export const deliveryReducer = createReducer(
  initialDeliveryState,
  on(updateDeliveryDetails, (state, { delivery }) => ({
    ...state,
    delivery: {
      ...delivery,
      customerId: delivery.customerId || 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      label: delivery.label || 'Home Address'
    },
  })),
  on(clearDeliveryDetails, (state) => ({ ...state, delivery: {
    customerId:'',
    label:'',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    street: '',
    streetNumber: '',
    region: '',
    country: '',
    postalCode: undefined,
    city: ''
  } }))
);

