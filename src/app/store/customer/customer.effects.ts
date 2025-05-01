import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as CustomerActions from './customer.actions';
import { Order } from '../../models/order.model';

@Injectable()
export class CustomerEffects {
  private baseUrl = 'http://localhost:8080/orders';

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  getCustomerOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.getCustomerOrders),
      switchMap(({ customerId }) =>
        this.http.get<Order[]>(`${this.baseUrl}/customer/${customerId}`).pipe(
          map(orders => CustomerActions.getCustomerOrdersSuccess({ orders })),
          catchError(error => {
            console.error('Error fetching customer orders:', error);
            return of(CustomerActions.getCustomerOrdersFailure({ error }));
          })
        )
      )
    )
  );
}
