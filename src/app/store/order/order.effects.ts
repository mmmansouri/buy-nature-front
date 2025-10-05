import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as OrderActions from './order.actions';
import { OrderService } from "../../services/order.service";
import { OrderCreationRequest } from "../../models/order-creation-request.model";
import { PaymentService } from "../../services/payment.service";
import { Order } from "../../models/order.model";
import { environment } from '../../../environments/environment';

@Injectable()
export class OrderEffects {
  private ordersUrl = `${environment.apiUrl}/orders`;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private paymentService: PaymentService,
    private orderService: OrderService
  ) {}

  /**
   * Confirm Order Effect
   * Checks if order already exists, if not creates a new one
   */
  confirmOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.confirmOrder),
      map(action => {
        const order = action.order;

        console.log('📋 Confirming order:', order.id ? 'existing' : 'new');

        // If order already has ID and payment intent, skip creation
        if (order.id && order.paymentIntent) {
          console.log('✅ Order already exists with payment intent');
          return OrderActions.createPaymentIntentSuccess({
            clientSecret: order.paymentIntent
          });
        }

        // Create new order
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

        console.log('🆕 Creating new order...');
        return OrderActions.createOrder({ orderCreationRequest });
      })
    )
  );

  /**
   * Create Order Effect
   * Calls backend API to create order
   */
  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      switchMap(action =>
        this.http.post<any>(this.ordersUrl, action.orderCreationRequest).pipe(
          map(response => {
            console.log('📦 Order created:', response.id);

            // Validate response
            if (!response.id || !response.customerId || !response.orderItems ||
              !response.status || !response.shippingAddress || !response.total) {
              throw new Error('Incomplete API response: required fields missing');
            }

            // Map response to Order model
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
          catchError(error => {
            console.error('❌ Order creation failed:', error);
            return of(OrderActions.createOrderFailure({ error }));
          })
        )
      )
    )
  );

  /**
   * Create Order Success Effect
   * Automatically triggers payment intent creation after order is created
   */
  createOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrderSuccess),
      map(({ order }) => {
        console.log('✅ Order created successfully:', order.id);
        console.log('💳 Creating payment intent for order...');
        return OrderActions.createPaymentIntent({ order });
      })
    )
  );

  /**
   * Create Payment Intent Effect
   * Calls payment service to create Stripe payment intent
   * IMPORTANT: This is the ONLY place where payment intent API is called
   */
  createPaymentIntent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createPaymentIntent),
      switchMap(({ order }) => {
        // Check if payment intent already exists
        if (order.paymentIntent) {
          console.log('✅ Payment intent already exists');
          return of(OrderActions.createPaymentIntentSuccess({
            clientSecret: order.paymentIntent
          }));
        }

        console.log('🔄 Calling payment API...');

        // Calculate total from order items
        const totalPrice = order.orderItems.reduce(
          (sum, item) => sum + (item.item.price * item.quantity),
          0
        );

        // Create new payment intent via API
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
          map(response => {
            console.log('✅ Payment intent created:', response.client_secret?.substring(0, 20) + '...');
            return OrderActions.createPaymentIntentSuccess({
              clientSecret: response.client_secret as string
            });
          }),
          catchError(error => {
            console.error('❌ Payment intent creation failed:', error);
            return of(OrderActions.createPaymentIntentFailure({ error }));
          })
        );
      })
    )
  );

  /**
   * Payment Intent Success Effect
   * Stores the payment intent in the order service
   */
  handlePaymentCreated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createPaymentIntentSuccess),
      tap(({ clientSecret }) => {
        console.log('💾 Storing payment intent...');
        this.orderService.handlePaymentCreated(clientSecret);
      })
    ),
    { dispatch: false }
  );
}