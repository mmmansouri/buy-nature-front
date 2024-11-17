import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Item} from "../../models/item.model";
import {ItemInCart} from "../../models/item.in.cart.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartState =  new BehaviorSubject<ItemInCart[]>([]); // Holds items in the cart
  public cartState$ = this.cartState.asObservable();


  addToCart(item: Item, quantity : number): void {
    const currentCart = this.cartState.value; // Get the current state
    const existingItem = currentCart.find(cartItem => cartItem.item.id === item.id);

    if (existingItem) {
      // If item exists, update its quantity
      existingItem.quantity += quantity;
    } else {
      // If item doesn't exist, add it to the cart
      currentCart.push({ item, quantity });
    }

    this.cartState.next([...currentCart]); // Emit updated cart state

  }

  // Removes an item from the cart
  removeFromCart(itemId: string): void {
    const updatedCart = this.cartState.value.filter(cartItem => cartItem.item.id !== itemId);
    this.cartState.next(updatedCart); // Emit updated cart state
  }

  // Clears the cart
  clearCart(): void {
    this.cartState.next([]); // Emit an empty cart
  }

  // Calculates total items in the cart
  getTotalItems(): number {
    return this.cartState.value.reduce((total, cartItem) => total + cartItem.quantity, 0);
  }

  // Calculates the total price of the cart
  getTotalPrice(): number {
    return this.cartState.value.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);
  }

}
