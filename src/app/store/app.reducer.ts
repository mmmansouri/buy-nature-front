import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storageSyncMetaReducer } from './storage.sync'; // Import the utility function
import { cartReducer } from './cart/cart.reducer';
import { deliveryReducer } from './delivery/delivery.reducer';
import { itemsReducer } from './items/items.reducer';

// Define your root state
export interface AppState {
  cart: any; // Replace with the actual cart state interface
  delivery: any; // Replace with the actual delivery state interface
  items: any; // Replace with the actual items state interface
}

// Map reducers to state properties
export const rootReducer: ActionReducerMap<AppState> = {
  cart: cartReducer,
  delivery: deliveryReducer,
  items: itemsReducer
};

// Apply meta-reducers
export const metaReducers: MetaReducer<AppState>[] = [storageSyncMetaReducer];
