import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storageSyncMetaReducer } from './storage.sync'; // Import the utility function
import { cartReducer } from './cart/cart.reducer';
import { deliveryReducer } from './delivery/delivery.reducer';
import { itemsReducer } from './items/items.reducer';
import { orderReducer } from './order/order.reducer';
import { customerReducer}  from "./customer/cutomer.reducer";

// Define your root state
export interface AppState {
  cart: any; // Replace with the actual cart state interface
  delivery: any; // Replace with the actual delivery state interface
  items: any; // Replace with the actual items state interface
  order: any; // Replace with the actual orders state interface
  customer: any; // Replace with the actual customer state interface
}

// Map reducers to state properties
export const rootReducer: ActionReducerMap<AppState> = {
  cart: cartReducer,
  delivery: deliveryReducer,
  items: itemsReducer,
  order: orderReducer,
  customer: customerReducer
};

// Apply meta-reducers
export const metaReducers: MetaReducer<AppState>[] = [storageSyncMetaReducer];
