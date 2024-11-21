import {AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
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
import {CartMiniComponent} from "../../pages/cart-mini/cart-mini.component";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ClickOutsideDirective, MatBadgeModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @ViewChild('miniCartContainer', { read: ViewContainerRef }) miniCartContainer!: ViewContainerRef;

  cartItems: ItemInCart[] = [];
  numberOfItemsInCart = 0;

  cartOpen: boolean = false;

  isItemLoaded = false; // Tracks when the item data is loaded
  isViewInitialized = false; // Tracks when the ViewChild references are initialized

  private cartMiniComponentInstance: CartMiniComponent | null = null; // Hold the instance of CartMiniComponent

  constructor(private sidenavService: SidenavService,private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartState$.subscribe({
      next: (cart) => {

        this.cartItems = cart;
        this.numberOfItemsInCart = this.cartItems.length;
        this.isItemLoaded = true; // Mark item as loaded
        this.tryLoadComponents(); // Attempt to load components

        console.log('Cart updated:', cart);
      },
      error: (err) => console.error('Error fetching cart:', err)
    })
  }

  // Method to dynamically load components into the grid
  private tryLoadComponents() {
    if (this.isItemLoaded && this.isViewInitialized) {
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
    this.cartMiniComponentInstance.cartItems = this.cartItems;
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
