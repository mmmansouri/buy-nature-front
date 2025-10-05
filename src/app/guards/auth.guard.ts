import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    console.log("customer authenticated");
    // For routes that require a customer profile
    const requiresCustomer = route.data?.['requiresCustomer'] === true;

    if (requiresCustomer && !authService.customerId()) {
      // If a customer profile is required but not available, redirect to create
      return router.createUrlTree(['/customer/create']);
    }

    // User is authenticated and meets route requirements
    return true;
  }

  console.log("customer not authenticated");

  // User is not authenticated, redirect to login page
  return router.createUrlTree(['/login']);
};
