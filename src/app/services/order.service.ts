import { Injectable } from '@angular/core';
import {filter, Observable, switchMap, take} from 'rxjs';
import { Store } from '@ngrx/store';
import { Order } from '../models/order.model';
import * as OrderActions from '../store/order/order.actions';
import { OrderState } from '../store/order/oder.state';
import { selectCurrentOrder } from '../store/order/order.selectors';
import { OrderItem } from '../models/order.item.model';
import { getOrderById, updateOrderItem } from '../store/order/order.actions';
import {ShippingAddress} from "../models/shipping-address.model";
import {OrderCreationRequest} from "../models/order-creation-request.model";
import {CartService} from "./cart.service";
import {OrderStatus} from "../models/order-stauts.model";
import { selectOrderCreationState } from '../store/order/order.selectors';
import {map} from "rxjs/operators";
import {DeliveryService} from "./delivery.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private store: Store<OrderState>,
              private cartService: CartService,
              private deliveryService: DeliveryService
  ) {}

  getOrder(): Observable<Order> {
    return this.store.select(selectCurrentOrder);
  }

  getOrderById(id: string): void {
    this.store.dispatch(getOrderById({ id }));
  }

  confirmOrder(): void {
    this.store.select(selectCurrentOrder).pipe(
      take(1),
      switchMap(order =>
        this.cartService.getCartItems().pipe(
          switchMap(items =>
            this.deliveryService.getDeliveryDetails().pipe(
              map(shippingAddress => ({
                ...order,
                shippingAddress,
                orderItems: items,
                status: OrderStatus.Pending,
                customerId: order.customerId? order.customerId : crypto.randomUUID()
              }))
            )
          )
        )
      )
    ).subscribe(updatedOrder => {
      this.store.dispatch(OrderActions.confirmOrder({ order: updatedOrder }));
    });
  }

  clearOrder(): void {
    this.cartService.clearCart();
    this.deliveryService.clearDeliveryDetails();
    this.store.dispatch(OrderActions.clearOrder());
  }

  createOrder(): Observable<'success' | 'error'>{
    return this.getOrder().pipe(
      take(1),
      map(order => {
        const orderItemRequest = new Map(
          order.orderItems.map(item => [item.item.id, item.quantity])
        );

        const orderCreationRequest: OrderCreationRequest = {
          customerId: order.customerId,
          status: OrderStatus.PaymentConfirmed,
          orderItems: orderItemRequest,
          total: order.orderItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0),
          shippingAddress: order.shippingAddress
        };

        this.store.dispatch(OrderActions.createOrder({ orderCreationRequest: orderCreationRequest }));
      }),
      switchMap(() => this.store.select(selectOrderCreationState)),
      filter((state): state is 'success' | 'error' =>
        state === 'success' || state === 'error'
      ),
      take(1)
    );
  }
  updateOrderItem(orderItem: OrderItem): void {
    this.store.dispatch(updateOrderItem({ orderItem }));
  }
  removeOrderItem(orderItemId: string): void {
    this.store.dispatch(OrderActions.removeOrderItem({orderItemId}));
  }
}
