import { Item } from "../../models/item.model";

export interface ItemsState {
    items: Item[];
    loading: boolean;
    error: any;
  }
  
  export const initialState: ItemsState = {
    items: [],
    loading: false,
    error: null
  };
  