import {AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, signal} from '@angular/core';
import { SidenavService } from "../sidenav/sidenav.service";
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatIconModule} from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from "@angular/router";
import { MatBadgeModule } from '@angular/material/badge';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {OrderItem} from "../../models/order.item.model";
import {CartMiniComponent} from "../../pages/cart-mini/cart-mini.component";
import {UserMenuComponent} from "../../pages/user-menu/user-menu.component";
import {Observable} from "rxjs";
import { CartService } from '../../services/cart.service';
import { MatMenuModule } from '@angular/material/menu';
import { UserAuthService } from "../../services/user-auth.service";
import { NotificationService, CartNotification } from "../../services/notification.service";
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-toolbar',
    imports: [
        MatMenuModule,
        MatBadgeModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        RouterLink,
        CommonModule,
        CurrencyPipe
    ],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    animations: [
      trigger('slideDown', [
        transition(':enter', [
          style({ transform: 'translateY(-20px)', opacity: 0 }),
          animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          animate('200ms ease-out', style({ transform: 'translateY(-10px)', opacity: 0 }))
        ])
      ])
    ]
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @ViewChild('miniCartContainer', { read: ViewContainerRef }) miniCartContainer!: ViewContainerRef;
  @ViewChild('userMenuContainer', { read: ViewContainerRef }) userMenuContainer!: ViewContainerRef;

  cartItems$: Observable<OrderItem[]>;
  totalItems$: Observable<number>; // Bind to total items count

  cartOpen: boolean = false;
  userMenuOpen: boolean = false;

  isViewInitialized = false; // Tracks when the ViewChild references are initialized

  private cartMiniComponentInstance: CartMiniComponent | null = null; // Hold the instance of CartMiniComponent
  private userMenuComponentInstance: UserMenuComponent | null = null; // Hold the instance of UserMenuComponent

  currentNotification = signal<CartNotification | null>(null);

  constructor(private sidenavService: SidenavService,
              private cartService: CartService,
              private userAuth: UserAuthService,
              private notificationService: NotificationService ) {
    this.cartItems$ = this.cartService.getCartItems();
    this.totalItems$ = this.cartService.getTotalItems();
  }

  ngOnInit() {
        this.tryLoadComponents(); // Attempt to load component

        // Subscribe to cart notifications
        this.notificationService.cartNotification$.subscribe(notification => {
          this.currentNotification.set(notification);
          // Auto-hide after 4 seconds
          setTimeout(() => {
            if (this.currentNotification()?.timestamp === notification.timestamp) {
              this.currentNotification.set(null);
            }
          }, 4000);
        });
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
    // Load Cart Mini
    this.miniCartContainer.clear();
    const cartMiniComponentRef = this.miniCartContainer.createComponent(CartMiniComponent);
    this.cartMiniComponentInstance = cartMiniComponentRef.instance;
    this.cartMiniComponentInstance.cartOpen = this.cartOpen;

    // Subscribe to cartOpenChange event
    this.cartMiniComponentInstance.cartOpenChange.subscribe((newCartOpen: boolean) => {
      this.cartOpen = newCartOpen; // Update the toolbar's cartOpen field
    });

    // Load User Menu
    this.userMenuContainer.clear();
    const userMenuComponentRef = this.userMenuContainer.createComponent(UserMenuComponent);
    this.userMenuComponentInstance = userMenuComponentRef.instance;
    this.userMenuComponentInstance.menuOpen = this.userMenuOpen;

    // Subscribe to menuOpenChange event
    this.userMenuComponentInstance.menuOpenChange.subscribe((newMenuOpen: boolean) => {
      this.userMenuOpen = newMenuOpen; // Update the toolbar's userMenuOpen field
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
    // Close user menu if open
    if (this.cartOpen && this.userMenuOpen) {
      this.userMenuOpen = false;
      if (this.userMenuComponentInstance) {
        this.userMenuComponentInstance.menuOpen = false;
      }
    }
  }

  toggleUserMenu(event: MouseEvent) {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuComponentInstance) {
      this.userMenuComponentInstance.menuOpen = this.userMenuOpen;
    }
    // Close cart if open
    if (this.userMenuOpen && this.cartOpen) {
      this.cartOpen = false;
      if (this.cartMiniComponentInstance) {
        this.cartMiniComponentInstance.cartOpen = false;
      }
    }
  }

  closeNotification() {
    this.currentNotification.set(null);
  }

}
