import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
        MatButton
    ],
    templateUrl: './cart-mini.component.html',
    styleUrl: './cart-mini.component.scss'
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

  increaseQuantity(item: Item): void {
    this.cartService.addToCart({ item, quantity:1});
    this.orderService.updateOrderItem({ item, quantity:1});
    this.stepperService.setStep(2);
  }

  decreaseQuantity(item: Item): void {
    this.cartService.addToCart({ item, quantity:-1});
    this.orderService.updateOrderItem({ item, quantity:-1});
    this.stepperService.setStep(2);
  }

}
