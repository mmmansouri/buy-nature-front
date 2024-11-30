
import { createReducer, on } from '@ngrx/store';

import { loadItems, loadItemsFailure, loadItemsSuccess } from './items.actions';
import { initialState } from './items.state';


export const itemsReducer = createReducer(
  initialState,
  on(loadItems, state => ({ ...state, loading: true })),
  on(loadItemsSuccess, (state, { items }) => ({ ...state, loading: false, items })),
  on(loadItemsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);