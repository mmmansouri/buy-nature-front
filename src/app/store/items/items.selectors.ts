import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './items.state';

export const selectItemsState = createFeatureSelector<ItemsState>('items');

export const selectAllItems = createSelector(
  selectItemsState,
  (state: ItemsState) => state.items
);

export const selectAllItemsLoading = createSelector(
  selectItemsState,
  (state: ItemsState) => state.loading
);

export const selectAllItemsError = createSelector(
  selectItemsState,
  (state: ItemsState) => state.error
);

export const selectItemById = (id: string) => createSelector(
  selectItemsState,
  (state: ItemsState) => state.items.find(item => item.id === id)
);