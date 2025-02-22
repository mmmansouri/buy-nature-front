import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as OrderActions from './order.actions';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OrderEffects {

  private ordersUrl = 'http://localhost:8080/orders';

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      mergeMap(action => {
        // Convert the Map to a plain object
        const orderItemsObj = Object.fromEntries(action.orderCreationRequest.orderItems.entries());
        const orderCreationRequestPayload = {
          ...action.orderCreationRequest,
          orderItems: orderItemsObj
        };
          return this.http.post<string>(this.ordersUrl, orderCreationRequestPayload).pipe(
            map(orderId => OrderActions.createOrderSuccess({orderId})),
            catchError(error => of(OrderActions.createOrderFailure({error})))
          )
        }
      )
    )
  );

}
