import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Order } from '../models/order.model';
import * as OrderActions from '../store/order/order.actions';
import { OrderState } from '../store/order/oder.state';
import { selectCurrentOrder } from '../store/order/order.selectors';
import { OrderItem } from '../models/order.item.model';
import { createOrder as createOrder, getOrderById, updateOrderItem } from '../store/order/order.actions';
import {ShippingAddress} from "../models/shipping-address.model";
import {OrderCreationRequest} from "../models/order-creation-request.model";
import {UUID} from "node:crypto";
import {CartService} from "./cart.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private store: Store<OrderState>,
              private cartService: CartService
  ) {}

  getOrder(): Observable<Order> {
    return this.store.select(selectCurrentOrder);
  }

  getOrderById(id: string): void {
    this.store.dispatch(getOrderById({ id }));
  }

  createOrder(orderItems : OrderItem[], shippingAddress: ShippingAddress): void {
    let orderItemRequest: Map<UUID, number> = new Map<UUID, number>();

    orderItems.map(orderItem =>
      orderItemRequest.set(orderItem.item.id, orderItem.quantity)
    )

    let totalPrice: number = 0;
    this.cartService.getTotalPrice().subscribe(totalPriceRequest => {
      totalPrice = totalPriceRequest;
    })

    let order: OrderCreationRequest = {
      customerId :crypto.randomUUID(),
      status : 'pending',
      orderItems: orderItemRequest,
      total: totalPrice,
      shippingAddress: shippingAddress
    }
    this.store.dispatch(createOrder({ orderCreationRequest: order }));
  }
  updateOrderItem(orderItem: OrderItem): void {
    this.store.dispatch(updateOrderItem({ orderItem }));
  }
  removeOrderItem(orderItemId: string): void {
    this.store.dispatch(OrderActions.removeOrderItem({orderItemId}));
  }
}
