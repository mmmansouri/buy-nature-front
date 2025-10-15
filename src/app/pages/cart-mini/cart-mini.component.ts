import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {CartService} from "../../services/cart.service";
import {OrderItem} from "../../models/order.item.model";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";
import {CurrencyPipe, NgIf, NgFor, AsyncPipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {Item} from "../../models/item.model";
import {MatButton, MatIconButton} from "@angular/material/button";
import { OrderService } from '../../services/order.service';
import { StepperService } from '../../services/stepper.service';
import { CartItemCardComponent } from '../../components/cart-item-card/cart-item-card';

@Component({
    selector: 'app-cart-mini',
    imports: [
        ClickOutsideDirective,
        NgIf,
        NgFor,
        CurrencyPipe,
        MatIcon,
        FormsModule,
        RouterLink,
        AsyncPipe,
        MatIconButton,
        MatButton,
        CartItemCardComponent
    ],
    templateUrl: './cart-mini.component.html',
    styleUrl: './cart-mini.component.scss',
    animations: [
      trigger('slideIn', [
        transition(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          animate('200ms cubic-bezier(0.4, 0, 1, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
        ])
      ])
    ]
})
export class CartMiniComponent implements OnInit {

  cartItems$: Observable<OrderItem[]>;
  totalPrice$: Observable<number>;

  @Input()
  cartOpen: boolean = false;

  @Output() cartOpenChange = new EventEmitter<boolean>();

  constructor(
    private orderService: OrderService, 
    private cartService: CartService,
    private stepperService: StepperService
  ) {
    this.cartItems$ = this.cartService.getCartItems();
    this.totalPrice$ = this.cartService.getTotalPrice();
  }

  ngOnInit() {
  }

  trackByItemId(index: number, cartItem: OrderItem): string {
    return cartItem.item.id;
  }

  closeCart() {
    this.cartOpen = false;
    this.cartOpenChange.emit(this.cartOpen);
  }

  // Delegate actions to the CartService
  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
    this.orderService.removeOrderItem(itemId);
    this.stepperService.setStep(2);
  }

  onQuantityIncrease(itemId: string): void {
    // Get the cart item from the observable
    this.cartItems$.subscribe(cartItems => {
      const cartItem = cartItems.find(ci => ci.item.id === itemId);
      if (cartItem) {
        this.cartService.addToCart({ item: cartItem.item, quantity: 1});
        this.orderService.updateOrderItem({ item: cartItem.item, quantity: 1});
        this.stepperService.setStep(2);
      }
    }).unsubscribe();
  }

  onQuantityDecrease(itemId: string): void {
    // Get the cart item from the observable
    this.cartItems$.subscribe(cartItems => {
      const cartItem = cartItems.find(ci => ci.item.id === itemId);
      if (cartItem) {
        this.cartService.addToCart({ item: cartItem.item, quantity: -1});
        this.orderService.updateOrderItem({ item: cartItem.item, quantity: -1});
        this.stepperService.setStep(2);
      }
    }).unsubscribe();
  }

}
