import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Order } from '../models/order.model';
import * as OrderActions from '../store/order/order.actions';
import { OrderState } from '../store/order/oder.state';
import { selectCurrentOrder } from '../store/order/order.selectors';
import { OrderItem } from '../models/order.item.model';
import { createOrUpdateOrder, getOrderById, updateOrderItem } from '../store/order/order.actions';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'your-api-url/orders';

  constructor(private http: HttpClient, private store: Store<OrderState>) {}

  getOrder(): Observable<Order> {
    return this.store.select(selectCurrentOrder);
  }

  getOrderById(id: string): void {
    this.store.dispatch(getOrderById({ id }));
  }

  createOrUpdateOrder(order: Order): void {
    this.store.dispatch(createOrUpdateOrder({ order }));
  }
  updateOrderItem(orderItem: OrderItem): void {
    this.store.dispatch(updateOrderItem({ orderItem }));
  }
  removeOrderItem(orderItemId: string): void {
    this.store.dispatch(OrderActions.removeOrderItem({orderItemId}));
  }
}