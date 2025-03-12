import { Injectable } from '@angular/core';
import { forkJoin, Observable, take} from 'rxjs';
import { Store } from '@ngrx/store';
import { Order } from '../models/order.model';
import * as OrderActions from '../store/order/order.actions';
import { OrderState } from '../store/order/oder.state';
import { selectCurrentOrder } from '../store/order/order.selectors';
import { OrderItem } from '../models/order.item.model';
import { getOrderById, updateOrderItem } from '../store/order/order.actions';
import {CartService} from "./cart.service";
import {OrderStatus} from "../models/order-stauts.model";
import {map} from "rxjs/operators";
import {DeliveryService} from "./delivery.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private store: Store<OrderState>,
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

  confirmOrder(): void {
    // Use forkJoin to get all required data in a single operation
    forkJoin({
      order: this.store.select(selectCurrentOrder).pipe(take(1)),
      items: this.cartService.getCartItems().pipe(take(1)),
      shippingAddress: this.deliveryService.getDeliveryDetails().pipe(take(1))
    }).pipe(
      take(1), // Ensure this only happens once
      map(({ order, items, shippingAddress }) => ({
        ...order,
        shippingAddress,
        orderItems: items,
        status: OrderStatus.Pending,
        customerId: order.customerId || crypto.randomUUID()
      }))
    ).subscribe(updatedOrder => {
      this.store.dispatch(OrderActions.confirmOrder({ order: updatedOrder }));
    });
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
