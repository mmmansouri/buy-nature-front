import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, take, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { Order } from '../models/order.model';
import * as OrderActions from '../store/order/order.actions';
import { OrderState } from '../store/order/oder.state';
import { selectCurrentOrder } from '../store/order/order.selectors';
import { OrderItem } from '../models/order.item.model';
import { getOrderById, updateOrderItem } from '../store/order/order.actions';
import { CartService } from "./cart.service";
import { OrderStatus } from "../models/order-stauts.model";
import { map, catchError } from "rxjs/operators";
import { DeliveryService } from "./delivery.service";
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private userAuth = inject(UserAuthService);

  constructor(
    private store: Store<OrderState>,
    private cartService: CartService,
    private deliveryService: DeliveryService
  ) {
  }

  getCurrentOrder(): Observable<Order> {
    return this.store.select(selectCurrentOrder);
  }

  getOrderById(id: string): void {
    this.store.dispatch(getOrderById({ id }));
  }

  /**
   * Confirm order and prepare for payment
   * Requires user to be logged in with a valid customerId
   *
   * @returns Observable that emits true if order confirmed, false if user not authenticated
   */
  confirmOrder(): Observable<boolean> {
    // Check if user is authenticated and has a customerId
    if (!this.userAuth.isAuthenticated() || !this.userAuth.customerId()) {
      console.error('❌ Cannot confirm order: User not authenticated or missing customer ID');
      return throwError(() => new Error('User must be logged in to place an order'));
    }

    const customerId = this.userAuth.customerId()!;
    console.log('✅ Confirming order for customer:', customerId);

    // Use forkJoin to get all required data in a single operation
    return forkJoin({
      order: this.store.select(selectCurrentOrder).pipe(take(1)),
      items: this.cartService.getCartItems().pipe(take(1)),
      shippingAddress: this.deliveryService.getDeliveryDetails().pipe(take(1))
    }).pipe(
      take(1),
      map(({ order, items, shippingAddress }) => {
        const updatedOrder = {
          ...order,
          shippingAddress,
          orderItems: items,
          status: OrderStatus.Pending,
          customerId // Use authenticated customer's ID
        };

        this.store.dispatch(OrderActions.confirmOrder({ order: updatedOrder }));
        return true;
      }),
      catchError(error => {
        console.error('❌ Error confirming order:', error);
        return throwError(() => error);
      })
    );
  }

  clearAllOrderData(): void {
    this.store.dispatch(OrderActions.clearOrder());
    this.cartService.clearCart();
    this.deliveryService.clearDeliveryDetails();

  }

  updateOrderItem(orderItem: OrderItem): void {

    this.store.dispatch(updateOrderItem({ orderItem }));
  }
  removeOrderItem(orderItemId: string): void {
    this.store.dispatch(OrderActions.removeOrderItem({orderItemId}));
  }

  handlePaymentCreated(paymentIntent: string): void {
    this.store.dispatch(OrderActions.orderPaymentCreated({ paymentIntent: paymentIntent }));
  }

  handlePaymentSuccess(orderId: string): void {
    this.store.dispatch(OrderActions.orderPaymentSuccess({ orderId }));
  }

  handlePaymentFailure(orderId: string): void {
    this.store.dispatch(OrderActions.orderPaymentFailure({ orderId }));
  }

}
