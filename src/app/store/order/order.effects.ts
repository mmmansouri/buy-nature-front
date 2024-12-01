
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import * as OrderActions from './order.actions';

@Injectable()
export class OrderEffects {
  constructor(
    private actions$: Actions,
    private orderService: OrderService
  ) {}

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.getOrders),
      mergeMap(() =>
        this.orderService.getOrders().pipe(
          map(orders => OrderActions.getOrdersSuccess({ orders })),
          catchError(error => of(OrderActions.getOrdersFailure({ error })))
        )
      )
    )
  );
}