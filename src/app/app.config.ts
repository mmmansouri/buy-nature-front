import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideStore } from '@ngrx/store';
import { cartReducer } from "./store/cart/cart.reducer";
import { deliveryReducer } from "./store/delivery/delivery.reducer";
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(withInterceptorsFromDi()),
    provideStore({
        cart: cartReducer,
        delivery: deliveryReducer,
    }), provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
