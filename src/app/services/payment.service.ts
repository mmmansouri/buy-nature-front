import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentIntent } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

export const PLUTO_ID = new InjectionToken<string>('[PLUTO] ClientID');

export const STRIPE_PUBLIC_KEY =
  'pk_live_51QRIzAIeQeVliWL7801HiHv8qD8h6SBpgohPu7xfe81I815TmxpraesH4GHdidY0vmOE2Udu9BaHCwXZAfHQAKbq00qfmS88pO';

/**
 * Payment Service
 * Handles Stripe payment intent creation
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(
    @Inject(PLUTO_ID) private readonly clientId: string,
    private readonly http: HttpClient
  ) {}

  /**
   * Create a payment intent for an order
   */
  createPaymentIntent(params: any): Observable<PaymentIntent> {
    console.log('💳 Payment Service: Creating payment intent', {
      amount: params.amount,
      orderId: params.orderId
    });

    return this.http.post<PaymentIntent>(
      `${environment.apiUrl}/create-payment-intent`,
      params,
      { headers: { merchant: this.clientId } }
    );
  }
}
