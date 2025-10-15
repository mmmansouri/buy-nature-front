import {Component, Input, OnInit} from '@angular/core';
import {OrderItem} from "../../../models/order.item.model";
import {CartService} from "../../../services/cart.service";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import { OrderService } from '../../../services/order.service';
import { CartItemCardComponent } from '../../../components/cart-item-card/cart-item-card';

@Component({
    selector: 'app-cart',
    imports: [
        CurrencyPipe,
        FormsModule,
        NgForOf,
        NgIf,
        AsyncPipe,
        CartItemCardComponent
    ],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cartItems$: Observable<OrderItem[]>;
  totalPrice$: Observable<number>;

  @Input() formGroup!: FormGroup;

  constructor(private orderService: OrderService, private cartService: CartService, private fb: FormBuilder) {

    this.cartItems$ = this.cartService.getCartItems();
    this.totalPrice$ = this.cartService.getTotalPrice();
  }

  ngOnInit() {
    // Initialize the 'items' control if it doesn't already exist
    if (!this.formGroup.contains('items')) {
      this.formGroup.addControl(
        'items',
        this.fb.control(null, [Validators.required]) // Add a required validator
      );
    }

    // Subscribe to cartItems$ and update the 'items' control's value
    this.cartItems$.subscribe(cartItems => {
      if (cartItems.length > 0) {
        this.formGroup.get('items')?.setValue(cartItems); // Set the value to the cart items
        this.formGroup.get('items')?.setErrors(null); // Clear any validation errors
      } else {
        this.formGroup.get('items')?.setValue(null); // Clear the value if the cart is empty
        this.formGroup.get('items')?.setErrors({ required: true }); // Set a required error
      }
    });
  }

  trackByItemId(index: number, cartItem: OrderItem): string {
    return cartItem.item.id;
  }

  // Delegate actions to the CartService
  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  onQuantityIncrease(itemId: string): void {
    // Get the cart item from the observable
    this.cartItems$.subscribe(cartItems => {
      const cartItem = cartItems.find(ci => ci.item.id === itemId);
      if (cartItem) {
        this.cartService.addToCart({ item: cartItem.item, quantity: 1});
        this.orderService.updateOrderItem({ item: cartItem.item, quantity: 1});
      }
    }).unsubscribe();
  }

  onQuantityDecrease(itemId: string): void {
    // Get the cart item from the observable
    this.cartItems$.subscribe(cartItems => {
      const cartItem = cartItems.find(ci => ci.item.id === itemId);
      if (cartItem) {
        this.cartService.addToCart({ item: cartItem.item, quantity: -1});
        this.orderService.updateOrderItem({ item: cartItem.item, quantity: -1});
      }
    }).unsubscribe();
  }

}
