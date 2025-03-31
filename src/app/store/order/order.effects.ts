import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap, tap} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as OrderActions from './order.actions';
import { HttpClient } from '@angular/common/http';
import {OrderService} from "../../services/order.service";
import {OrderCreationRequest} from "../../models/order-creation-request.model";
import {ItemsService} from "../../services/items.service";
import {PaymentService} from "../../services/payment.service";
import {Order} from "../../models/order.model";
import {createPaymentIntentSuccess} from "./order.actions";

@Injectable()
export class OrderEffects {

  private ordersUrl = 'http://localhost:8080/orders';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private itemsService: ItemsService,
    private paymentService: PaymentService,
    private orderService: OrderService

  ) {}

  confirmOrder$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(OrderActions.confirmOrder),
        map(action => {
          const order = action.order;

          // If the order already has an ID, don't create a new one
          if (order.id && order.paymentIntent) {
            return OrderActions.createPaymentIntentSuccess({clientSecret: order.paymentIntent});
          }

          const orderItems = order.orderItems.map(item => ({
            itemId: item.item.id,
            quantity: item.quantity
          }));

          const orderCreationRequest: OrderCreationRequest = {
            customerId: order.customerId,
            orderItems: orderItems,
            total: order.orderItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0),
            shippingAddress: order.shippingAddress
          };

          return OrderActions.createOrder({orderCreationRequest});
        })
      );
    }
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      switchMap(action =>
        this.http.post<any>(this.ordersUrl, action.orderCreationRequest).pipe(
          map(response => {
            // Vérifier les champs obligatoires
            if (!response.id || !response.customerId || !response.orderItems ||
              !response.status || !response.shippingAddress || !response.total) {
              throw new Error('Réponse API incomplète: champs obligatoires manquants');
            }

            // Mapper la réponse au modèle Order
            const order: Order = {
              id: response.id,
              customerId: response.customerId,
              status: response.status,
              paymentStatus: response.paymentStatus || 'PENDING',
              paymentIntent: response.paymentIntent || '',
              orderItems: response.orderItems,
              shippingAddress: response.shippingAddress
            };

            return OrderActions.createOrderSuccess({ order });
          }),
          catchError(error => of(OrderActions.createOrderFailure({ error })))
        )
      )
    )
  );

  createOrderSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.createOrderSuccess),
        tap((action) => {
          console.log(`Order created successfully with ID: ${action.order.id}`);
        })
      ),
    { dispatch: false }
  );

  createPaymentIntent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrderSuccess),
      map(({order}) => OrderActions.createPaymentIntent({order}))
    )
  );

  processPaymentIntent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createPaymentIntent),
      switchMap(({order}) => {
        // Check if payment intent already exists
        if (order.paymentIntent) {
          return of(OrderActions.createPaymentIntentSuccess({
            clientSecret: order.paymentIntent
          }));
        }

        // Calculate total from order items
        const totalPrice = order.orderItems.reduce(
          (sum, item) => sum + (item.item.price * item.quantity),
          0
        );

        // Create new payment intent
        return this.paymentService.createPaymentIntent({
          amount: totalPrice,
          email: order.shippingAddress?.email || '',
          orderId: order.id,
          phone: order.shippingAddress?.phoneNumber || '',
          state: order.shippingAddress?.region || '',
          customerId: order.customerId || '',
          productName: order.orderItems.length > 1
            ? `${order.orderItems[0].item.name} and more`
            : order.orderItems[0]?.item.name || "Products"
        }).pipe(
          map(response => OrderActions.createPaymentIntentSuccess({
            clientSecret: response.client_secret as string
          })),
          catchError(error => of(OrderActions.createPaymentIntentFailure({error})))
        );
      })
    )
  );

  handlePaymentCreated$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.createPaymentIntentSuccess),
        tap(({clientSecret}) => {
          // You'll need to inject OrderService in the constructor
          this.orderService.handlePaymentCreated(clientSecret);
        })
      ),
    {dispatch: false}
  );
}
