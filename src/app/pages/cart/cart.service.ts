import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartState = new BehaviorSubject<number>(0); // false means closed by default
  public cartState$ = this.cartState.asObservable();


  addToCart(quantity : number): void {
    const currentNumber = this.cartState.value +quantity;
    this.cartState.next(currentNumber);

  }

}
