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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(rootReducer, { metaReducers }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([ItemsEffects]),
    provideNgxStripe("pk_live_51QRIzAIeQeVliWL7801HiHv8qD8h6SBpgohPu7xfe81I815TmxpraesH4GHdidY0vmOE2Udu9BaHCwXZAfHQAKbq00qfmS88pO"),
    {
      provide: PLUTO_ID,
      useValue: '449f8516-791a-49ab-a09d-50f79a0678b6',
    }
  ],
};
