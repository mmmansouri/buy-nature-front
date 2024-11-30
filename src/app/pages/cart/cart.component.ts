import {Component, Input, OnInit} from '@angular/core';
import {OrderItem} from "../../models/order.item.model";
import {CartService} from "./cart.service";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Item} from "../../models/item.model";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    CurrencyPipe,
    FormsModule,
    MatIcon,
    NgForOf,
    NgIf,
    RouterLink,
    MatIconButton,
    MatButton,
    AsyncPipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cartItems$: Observable<OrderItem[]>;
  totalPrice$: Observable<number>;

  @Input() formGroup!: FormGroup;

  constructor(private cartService: CartService, private fb: FormBuilder) {

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

  // Delegate actions to the CartService
  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  increaseQuantity(item: Item): void {
    this.cartService.addToCart({ item, quantity:1});
  }

  decreaseQuantity(item: Item): void {
    this.cartService.addToCart({ item, quantity:-1});
  }

}
