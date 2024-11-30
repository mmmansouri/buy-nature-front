
import { createAction, props } from '@ngrx/store';
import { Item } from '../../models/item.model';

export const loadItems = createAction('[Items] Load Items');
export const loadItemsSuccess = createAction('[Items] Load Items Success', props<{ items: Item[] }>());
export const loadItemsFailure = createAction('[Items] Load Items Failure', props<{ error: any }>());