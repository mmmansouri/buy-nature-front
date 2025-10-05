import {Injectable} from "@angular/core";
import {Item} from "../models/item.model";
import { Observable } from "rxjs";
import { Store } from '@ngrx/store';
import { loadItems } from "../store/items/items.actions";
import { selectAllItems, selectItemById } from "../store/items/items.selectors";


@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private store: Store) {
    // Don't dispatch loadItems in constructor - let components control when to load
  }

  loadItems(): void {
    this.store.dispatch(loadItems());
  }

  getItemById(id: string): Observable<Item | undefined> {
    return this.store.select(selectItemById(id));
  }

  getAllItems(): Observable<Item[]> {
    return this.store.select(selectAllItems);
  }
}
