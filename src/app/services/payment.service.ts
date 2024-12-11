import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { PaymentIntent } from '@stripe/stripe-js';

export const PLUTO_ID = new InjectionToken<string>('[PLUTO] ClientID');

export const STRIPE_PUBLIC_KEY =
  'pk_live_51QRIzAIeQeVliWL7801HiHv8qD8h6SBpgohPu7xfe81I815TmxpraesH4GHdidY0vmOE2Udu9BaHCwXZAfHQAKbq00qfmS88pO';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private static readonly BASE_URL = 'http://localhost:8080';

  constructor(
    @Inject(PLUTO_ID) private readonly clientId: string,
    private readonly http: HttpClient
  ) {}

  createPaymentIntent(params: any): Observable<PaymentIntent> {
    console.log('Creating payment intent');
    return this.http.post<PaymentIntent>(
      `${PaymentService.BASE_URL}/create-payment-intent`,
      params,
      { headers: { merchant: this.clientId } }
    );
  }
}