import {Injectable} from "@angular/core";
import {Item} from "../../models/item.model";
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of, switchMap, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private itemsUrl = 'assets/mock-data/items.json';
  private itemsCache: Item[] | null = null; // Cache for items

  constructor(private http: HttpClient) {}

  // Method to get an item by ID, using the cached items if available
  getItemById(id: string): Observable<Item | undefined> {
    if (this.itemsCache) {
      // If items are cached, find and return the item by ID
      const item = this.itemsCache.find(item => item.id === id);
      return of(item);
    } else {
      // Load items if not cached, then find the item by ID
      return this.getAllItems().pipe(
        tap(items => this.itemsCache = items), // Cache items once loaded
        map(items => items.find(item => item.id == id)) // Directly return the found item
      );
    }
  }

  getAllItems() : Observable<Item[]> {
    if (this.itemsCache) {
      return of(this.itemsCache); // Return cached items if available
    }
    return this.http.get<Item[]>(this.itemsUrl).pipe(
      tap(items => this.itemsCache = items),
      // Cache the items on first load
      catchError(error => {
        console.error('Error loading items', error);
        return of([]); // Return an empty array on error
      })
    );
  }
}
