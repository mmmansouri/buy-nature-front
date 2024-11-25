import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addItem, removeItem, clearCart } from '../../store/cart/cart.actions';

import { selectCartItems, selectCartTotalItems, selectCartTotalPrice } from '../../store/cart/cart.selectors';
import {ItemInCart} from "../../models/item.in.cart.model";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private store: Store) {}

  // Selectors to get cart data
  getCartItems(): Observable<ItemInCart[]> {
    return this.store.select(selectCartItems);
  }

  getTotalItems(): Observable<number> {
    return this.store.select(selectCartTotalItems);
  }

  getTotalPrice(): Observable<number> {
    return this.store.select(selectCartTotalPrice);
  }

  // Dispatch actions to modify cart state
  addToCart(itemInCart: ItemInCart): void {
    this.store.dispatch(addItem({ itemInCart }));
  }

  removeFromCart(itemId: string): void {
    this.store.dispatch(removeItem({ itemId }));
  }

  clearCart(): void {
    this.store.dispatch(clearCart());
  }
}
