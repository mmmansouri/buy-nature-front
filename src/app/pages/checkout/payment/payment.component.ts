import { Component,  inject,  OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ShippingAddress } from '../../../models/shipping-address.model';
import { DeliveryService } from '../../../services/delivery.service';
import { CartService } from '../../../services/cart.service';
import { PaymentService } from '../../../services/payment.service';
import { MatProgressSpinner} from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    MatCardModule,
    MatProgressSpinner,
    StripeElementsDirective,
    StripePaymentElementComponent
  ]
})
export class PaymentComponent implements OnInit {

  delivery$: Observable<ShippingAddress>;
  private readonly dialog = inject(MatDialog);

  constructor(private deliveryService: DeliveryService,private cartService:CartService, private paymentService: PaymentService, private fb: UntypedFormBuilder) {
    this.delivery$ = this.deliveryService.getDeliveryDetails();

  }

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;


  paymentElementForm = this.fb.group({
    name: ['John doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
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
  paying = signal(false);

  ngBeforeViewInit() {

  }
  ngOnInit() {
    // Subscribe to delivery$ to prefill form values
    this.delivery$.subscribe(delivery => {
      if (delivery) {
        this.paymentElementForm.patchValue({
          name: delivery.firstname + ' ' + delivery.lastname,
          email: delivery.email,
          address: delivery.address.street,
          zipcode: "1122",
          city: "tunis"
        });
      }
    });

    this.cartService.getTotalPrice().subscribe(totalPrice => {
      this.paymentElementForm.patchValue({
        amount: totalPrice});
      })

      this.paymentService
      .createPaymentIntent({
        "amount": this.paymentElementForm.get('amount')?.value,
        "email": this.paymentElementForm.get('email')?.value,
        "productName": "Lemon Haze",
      })
      .subscribe((pi) => {
        this.elementsOptions.clientSecret = pi.client_secret as string;
      });
  
  }

  pay(): Observable<boolean> {
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
              address: {
                line1: this.paymentElementForm.get('address')?.value as string,
                postal_code: this.paymentElementForm.get('zipcode')?.value as string,
                city: this.paymentElementForm.get('city')?.value as string
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
            this.dialog.open(PaymentDialogComponent, { data: result });
            return false;
          } else if (result.paymentIntent.status === 'succeeded') {
            return true;
          }
          return false;
        }),
        catchError(err => {
          this.paying.set(false);
          this.dialog.open(PaymentDialogComponent, { data: err });
          return of(false);
        })
      );
  }
}