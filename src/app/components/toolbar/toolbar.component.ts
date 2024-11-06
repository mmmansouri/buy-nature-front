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

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ClickOutsideDirective, MatBadgeModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  quantity: number = 0;
  cartOpen: boolean = false;

  constructor(private sidenavService: SidenavService,private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartState$.subscribe((quantity : number) => {
      this.quantity = quantity;
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
