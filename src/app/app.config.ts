import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { ItemsEffects } from './store/items/items.effects';
import { metaReducers, rootReducer } from './store/app.reducer';
import { provideNgxStripe } from 'ngx-stripe';
import { PLUTO_ID } from './services/payment.service';
import { OrderEffects } from "./store/order/order.effects";
import { CustomerEffects } from "./store/customer/customer.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(rootReducer, { metaReducers }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([ItemsEffects, OrderEffects, CustomerEffects]),
    provideNgxStripe("pk_test_51QRIzAIeQeVliWL72uY9gQCp0VDTYHwVR1zLG0ewOP0MFtBQGe4nRnZ8wFyGuwxepmLd9cVIiGNGovV5eFuA1rG600lv2xvRVl"),
    {
      provide: PLUTO_ID,
      useValue: '449f8516-791a-49ab-a09d-50f79a0678b6',
    }
  ],
};
