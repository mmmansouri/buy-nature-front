import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {of, tap} from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as OrderActions from './order.actions';
import { HttpClient } from '@angular/common/http';
import {OrderService} from "../../services/order.service";
import {OrderCreationRequest} from "../../models/order-creation-request.model";

@Injectable()
export class OrderEffects {

  private ordersUrl = 'http://localhost:8080/orders';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private orderService: OrderService
  ) {}

  confirmOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.confirmOrder),
      map(action => {
        const order = action.order;

        // If the order already has an ID, don't create a new one
        if (order.id) {
          return OrderActions.createOrderSuccess({ orderId: order.id });
        }

        const orderItemsObj: Record<string, number> = {};
        order.orderItems.forEach(item => {
          orderItemsObj[item.item.id] = item.quantity;
        });

        const orderCreationRequest: OrderCreationRequest = {
          customerId: order.customerId,
          status: 'CREATED',
          orderItems: orderItemsObj,
          total: order.orderItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0),
          shippingAddress: order.shippingAddress
        };

        return OrderActions.createOrder({ orderCreationRequest });
      })
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      mergeMap(action => {
          return this.http.post<string>(this.ordersUrl, action.orderCreationRequest).pipe(
            map(orderId => OrderActions.createOrderSuccess({orderId: orderId.toString()})),
            catchError(error => of(OrderActions.createOrderFailure({error})))
          )
        }
      )
    )
  );

  createOrderSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.createOrderSuccess),
        tap((action) => {
          console.log(`Order created successfully with ID: ${action.orderId}`);
        })
      ),
    { dispatch: false }
  );

}
