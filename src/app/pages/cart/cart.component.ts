import {Component, Input, OnInit} from '@angular/core';
import {ItemInCart} from "../../models/item.in.cart.model";
import {CartService} from "./cart.service";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

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
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  @Input()
  cartItems: ItemInCart[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartState$.subscribe(cart => {
      this.cartItems = cart;
    })
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
