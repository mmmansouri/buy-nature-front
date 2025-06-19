import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as CustomerActions from './customer.actions';
import { Order } from '../../models/order.model';
import {Customer} from "../../models/customer.model";

@Injectable()
export class CustomerEffects {
  private baseUrl = 'http://localhost:8080/orders';
  private baseCustomerUrl = 'http://localhost:8080/customers';

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

  getCustomerProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.getCustomerProfile),
      switchMap(({ customerId }) =>
        this.http.get<Customer>(`${this.baseCustomerUrl}/${customerId}`).pipe(
          map(customer => CustomerActions.getCustomerProfileSuccess({ customer })),
          catchError(error => {
            console.error('Error fetching customer profile:', error);
            return of(CustomerActions.getCustomerProfileFailure({ error }));
          })
        )
      )
    )
  );

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomer),
      switchMap(({ customerRequest }) =>
        this.http.post<string>(`${this.baseCustomerUrl}`, customerRequest).pipe(
          map(customerId => CustomerActions.createCustomerSuccess({ customerId })),
          catchError(error => {
            console.error('Error creating customer:', error);
            return of(CustomerActions.createCustomerFailure({ error }));
          })
        )
      )
    )
  );
}
