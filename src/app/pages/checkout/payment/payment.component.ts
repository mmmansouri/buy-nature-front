import { Component,  OnInit, signal, ViewChild } from '@angular/core';
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
import { Observable } from 'rxjs';
import { Delivery } from '../../../models/delivery.model';
import { DeliveryService } from '../../../services/delivery.service';
import { CartService } from '../../../services/cart.service';
import { PaymentService } from '../../../services/payment.service';
import { MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';


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

  delivery$: Observable<Delivery>;

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
    amount: [2500, [Validators.required, Validators.pattern(/d+/)]]
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

  
  stripe = injectStripe("pk_live_51QRIzAIeQeVliWL7801HiHv8qD8h6SBpgohPu7xfe81I815TmxpraesH4GHdidY0vmOE2Udu9BaHCwXZAfHQAKbq00qfmS88pO");
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

  pay() {
    console.log(this.paymentElementForm.invalid);
    console.log(this.paymentElementForm);
    if (this.paying() || this.paymentElementForm.invalid) return;
    this.paying.set(true);

    console.log('Payment Element', this.paymentElement);

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: "name as string",
              email: "email as string",
              address: {
                line1: "address as string",
                postal_code: "zipcode as string",
                city: "city as string"
              }
            }
          }
        },
        redirect: 'if_required'
      })
      .subscribe(result => {
        this.paying.set(false);
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
  }
}