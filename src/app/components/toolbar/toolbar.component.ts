import {Component, OnInit} from '@angular/core';
import { SidenavService } from "../sidenav/sidenav.service";
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatIconModule} from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatBadgeModule } from '@angular/material/badge';
import {CartService} from "../../pages/cart/cart.service";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatBadgeModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  quantity: number = 0;

  constructor(private sidenavService: SidenavService,private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartState$.subscribe((quantity : number) => {
      this.quantity = quantity;
    })
  }




  toggleMenu() {

      this.sidenavService.toggleSidenav();

  }

  displayCart() {

  }

}
