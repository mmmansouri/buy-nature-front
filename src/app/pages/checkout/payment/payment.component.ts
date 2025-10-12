import { Component, inject, signal, ViewChild, effect } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, map, take, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';

import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { OrderService } from "../../../services/order.service";
import { selectCurrentOrder, selectPaymentClientSecret } from '../../../store/order/order.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Payment Component - Modern Angular 18+ Implementation
 *
 * Features:
 * - Signal-based state management
 * - Automatic payment intent initialization
 * - Single API call with proper error handling
 * - Clean separation of concerns
 */
@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinner,
        MatIcon,
        StripeElementsDirective,
        StripePaymentElementComponent
    ]
})
export class PaymentComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  private readonly store = inject(Store);
  private readonly orderService = inject(OrderService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(UntypedFormBuilder);

  // Signals for reactive state
  readonly paying = signal<boolean>(false);
  readonly clientSecret = toSignal(
    this.store.select(selectPaymentClientSecret).pipe(
      filter(secret => !!secret)
    )
  );

  // Stripe instance
  readonly stripe = injectStripe(
    "pk_test_51QRIzAIeQeVliWL7EvK7n3Lr8iNmwIcYxkOjYHZ7UWJcpYWyFjRgeZEmgtHhtk2JV6ngn6BqUvKUojco8uKJ38Rr00KFkebO76"
  );

  // Payment form
  paymentElementForm = this.fb.group({
    name: ['John doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    phone: [''],
    state: [''],
    amount: [2500, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
  });

  // Stripe Elements configuration
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: {
      theme: 'flat',
    },
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false
    }
  };

  constructor() {
    // Effect to update elementsOptions when clientSecret changes
    effect(() => {
      const secret = this.clientSecret();
      if (secret) {
        console.log('💳 Payment Intent ready:', secret.substring(0, 20) + '...');
        // Update with correct type
        this.elementsOptions = {
          locale: 'en',
          appearance: {
            theme: 'flat',
          },
          clientSecret: secret
        } as StripeElementsOptions;
      }
    });

    // Initialize payment on component creation
    this.initializePayment();
  }

  /**
   * Initialize payment component
   * Order should already be confirmed by CheckoutComponent
   * This just logs the payment initialization status
   */
  private initializePayment(): void {
    console.log('🔄 Payment component initialized');
    console.log('⏳ Waiting for payment intent from CheckoutComponent...');

    // Monitor payment intent status
    this.store.select(selectCurrentOrder).pipe(
      take(1)
    ).subscribe(order => {
      if (order.paymentIntent) {
        console.log('✅ Payment intent already available');
      } else {
        console.log('⏳ Payment intent will be created by order confirmation flow');
      }
    });
  }

  /**
   * Process payment with Stripe
   */
  pay(): Observable<boolean> {
    // Validation checks
    if (!this.paymentElement || !this.paymentElement.elements) {
      console.error('❌ Payment Element is not yet mounted.');
      return of(false);
    }

    if (this.paying() || this.paymentElementForm.invalid) {
      console.warn('⚠️  Payment already in progress or form invalid');
      return of(false);
    }

    console.log('💰 Processing payment...');
    this.paying.set(true);

    return this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.paymentElementForm.get('name')?.value as string,
              email: this.paymentElementForm.get('email')?.value as string,
              phone: this.paymentElementForm.get('phone')?.value as string,
              address: {
                line1: this.paymentElementForm.get('address')?.value as string,
                postal_code: this.paymentElementForm.get('zipcode')?.value as string,
                city: this.paymentElementForm.get('city')?.value as string,
                state: this.paymentElementForm.get('state')?.value as string
              }
            }
          }
        },
        redirect: 'if_required'
      })
      .pipe(
        map(result => {
          this.paying.set(false);

          if (result.error) {
            console.error('❌ Payment failed:', result.error);
            this.dialog.open(PaymentDialogComponent, { data: result });
            return false;
          }

          if (result.paymentIntent.status === 'succeeded') {
            console.log('✅ Payment succeeded!');
            return true;
          }

          console.warn('⚠️  Payment status:', result.paymentIntent.status);
          return false;
        }),
        catchError(err => {
          console.error('❌ Payment error:', err);
          this.paying.set(false);
          this.dialog.open(PaymentDialogComponent, { data: err });
          return of(false);
        })
      );
  }
}