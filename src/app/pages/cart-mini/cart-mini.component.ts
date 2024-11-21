import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartService} from "../cart/cart.service";
import {ItemInCart} from "../../models/item.in.cart.model";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {CurrencyPipe, NgIf, NgFor} from "@angular/common";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cart-mini',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    NgIf,
    NgFor,
    CurrencyPipe,
    MatFormField,
    MatIcon,
    FormsModule,
    RouterLink
  ],
  templateUrl: './cart-mini.component.html',
  styleUrl: './cart-mini.component.scss'
})
export class CartMiniComponent implements OnInit {

  @Input()
  cartItems: ItemInCart[] = [];

  @Input()
  cartOpen: boolean = false;

  @Output() cartOpenChange = new EventEmitter<boolean>();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartState$.subscribe(cart => {
      this.cartItems = cart;
    })
  }

  closeCart() {
    this.cartOpen = false;
    this.cartOpenChange.emit(this.cartOpen);
  }

  increaseQuantity(index: number): void {
    this.cartService.addToCart(this.cartItems[index].item, 1)
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartService.addToCart(this.cartItems[index].item, -1)
    }
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(this.cartItems[index].item.id)
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);
  }

}
