import {Component, Input, OnInit} from '@angular/core';
import {ItemInCart} from "../../models/item.in.cart.model";
import {CartService} from "./cart.service";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule} from "@angular/forms";
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

  cartItems$: Observable<ItemInCart[]>;
  totalPrice$: Observable<number>;

  @Input() formGroup!: FormGroup;

  constructor(private cartService: CartService, private fb: FormBuilder) {

    this.cartItems$ = this.cartService.getCartItems();
    this.totalPrice$ = this.cartService.getTotalPrice();
  }

  ngOnInit() {
    // Initialize dummy control to satisfy parent form validation
    this.formGroup?.addControl('items', this.fb.control(null, { validators: [] }));
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
