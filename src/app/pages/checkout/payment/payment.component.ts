import {AfterViewInit, Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import {Observable, of, switchMap, take} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatDialog} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {PaymentDialogComponent} from './payment-dialog/payment-dialog.component';
import {Actions, ofType} from '@ngrx/effects';
import * as OrderActions from '../../../store/order/order.actions';
import {OrderService} from "../../../services/order.service";

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinner,
    StripeElementsDirective,
    StripePaymentElementComponent
  ]
})
export class PaymentComponent implements OnInit, AfterViewInit {


  private readonly dialog = inject(MatDialog);

  constructor(private orderService: OrderService,
              private fb: UntypedFormBuilder,
              private actions$: Actions) {

  }

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;


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

  stripe = injectStripe("pk_test_51QRIzAIeQeVliWL72uY9gQCp0VDTYHwVR1zLG0ewOP0MFtBQGe4nRnZ8wFyGuwxepmLd9cVIiGNGovV5eFuA1rG600lv2xvRVl");
  paying = signal<boolean>(false);

  ngOnInit() {
    // Just subscribe to the success action to update the component
    this.actions$.pipe(
      ofType(OrderActions.createPaymentIntentSuccess),
      take(1)
    ).subscribe(({clientSecret}) => {
      console.log("hEEEE");
      console.log(clientSecret);
      this.elementsOptions.clientSecret = clientSecret;
    });
  }

  ngAfterViewInit() {
    this.orderService.confirmOrder();
  }

  pay(): Observable<boolean> {
    // Check if Payment Element is mounted
    if (!this.paymentElement || !this.paymentElement.elements) {
      console.error('Payment Element is not yet mounted.');
      return of(false);
    }
    console.log(this.paymentElementForm);

    if (this.paying() || this.paymentElementForm.invalid) return of(false);
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
          console.log(result);
          if (result.error) {
            this.dialog.open(PaymentDialogComponent, {data: result});
            return false;
          } else if (result.paymentIntent.status === 'succeeded') {
            return true;
          }
          return false;
        }),
        catchError(err => {
          console.log(err)
          this.paying.set(false);
          this.dialog.open(PaymentDialogComponent, {data: err});
          return of(false);
        })
      );
  }
}
