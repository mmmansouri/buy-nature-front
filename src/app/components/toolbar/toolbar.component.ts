import {AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { SidenavService } from "../sidenav/sidenav.service";
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatIconModule} from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatBadgeModule } from '@angular/material/badge';
import {CommonModule} from "@angular/common";
import {OrderItem} from "../../models/order.item.model";
import {CartMiniComponent} from "../../pages/cart-mini/cart-mini.component";
import {Observable} from "rxjs";
import { CartService } from '../../services/cart.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatMenuModule,
    MatBadgeModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @ViewChild('miniCartContainer', { read: ViewContainerRef }) miniCartContainer!: ViewContainerRef;

  cartItems$: Observable<OrderItem[]>;
  totalItems$: Observable<number>; // Bind to total items count

  cartOpen: boolean = false;

  isViewInitialized = false; // Tracks when the ViewChild references are initialized

  private cartMiniComponentInstance: CartMiniComponent | null = null; // Hold the instance of CartMiniComponent

  constructor(private sidenavService: SidenavService,private cartService: CartService) {
    this.cartItems$ = this.cartService.getCartItems();
    this.totalItems$ = this.cartService.getTotalItems();
  }

  ngOnInit() {
        this.tryLoadComponents(); // Attempt to load component

  }

  // Method to dynamically load components into the grid
  private tryLoadComponents() {
    if (this.isViewInitialized) {
      // Only proceed if both the item and view references are ready
      this.loadComponents();
    }
  }

  ngAfterViewInit() {
    this.isViewInitialized = true; // Mark view as initialized
    this.tryLoadComponents(); // Attempt to load components
  }

  private loadComponents() {
    this.miniCartContainer.clear();

    const cartMiniComponentRef = this.miniCartContainer.createComponent(CartMiniComponent);
    this.cartMiniComponentInstance = cartMiniComponentRef.instance;
    this.cartMiniComponentInstance.cartOpen = this.cartOpen;

    // Subscribe to cartOpenChange event
    this.cartMiniComponentInstance.cartOpenChange.subscribe((newCartOpen: boolean) => {
      this.cartOpen = newCartOpen; // Update the toolbar's cartOpen field
    });
  }


  toggleMenu() {
      this.sidenavService.toggleSidenav();
  }

  toggleCartShow(event: MouseEvent) {
    event.stopPropagation();
    this.cartOpen = !this.cartOpen;
    if (this.cartMiniComponentInstance) {
      this.cartMiniComponentInstance.cartOpen = this.cartOpen;
    }
  }

}
