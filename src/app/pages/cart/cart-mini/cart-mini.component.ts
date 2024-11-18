import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SidenavService} from "../../../components/sidenav/sidenav.service";
import {CartService} from "../cart.service";
import {ItemInCart} from "../../../models/item.in.cart.model";
import {ClickOutsideDirective} from "../../../directives/click-outside.directive";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-cart-mini',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    NgIf
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

}
