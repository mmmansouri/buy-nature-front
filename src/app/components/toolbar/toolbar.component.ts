import {Component, OnInit} from '@angular/core';
import { SidenavService } from "../sidenav/sidenav.service";
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatIconModule} from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatBadgeModule } from '@angular/material/badge';
import {CartService} from "../../pages/cart/cart.service";
import {CommonModule} from "@angular/common";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {ItemInCart} from "../../models/item.in.cart.model";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ClickOutsideDirective, MatBadgeModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  cartItems: ItemInCart[] = [];
  numberOfItemsInCart = 0;

  cartOpen: boolean = false;

  constructor(private sidenavService: SidenavService,private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartState$.subscribe(cart => {
      this.cartItems = cart;
      this.numberOfItemsInCart = this.cartItems.length;
      console.log('Cart updated:', cart);
    })
  }




  toggleMenu() {
      this.sidenavService.toggleSidenav();
  }

  toggleCartShow(event: MouseEvent) {
    event.stopPropagation();
    this.cartOpen = !this.cartOpen;
  }

  closeCart() {
    this.cartOpen = false;
  }

}
