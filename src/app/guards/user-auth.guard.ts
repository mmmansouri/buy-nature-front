import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

/**
 * User Authentication Guard
 * Protects routes that require user login (Tier 2 authentication)
 *
 * Route data options:
 * - requiresCustomer: boolean - If true, user must have a customer profile
 */
export const userAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const userAuth = inject(UserAuthService);
  const router = inject(Router);

  const customerId = userAuth.customerId();
  const isAuthenticated = userAuth.isAuthenticated();
  const requiresCustomer = route.data?.['requiresCustomer'] === true;

  console.log('🛡️ Auth Guard Check:', {
    route: route.routeConfig?.path,
    isAuthenticated,
    customerId,
    requiresCustomer
  });

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('❌ User not authenticated, redirecting to login');
    // Store the attempted URL for redirect after login
    const returnUrl = route.url.map(segment => segment.path).join('/');
    sessionStorage.setItem('returnUrl', returnUrl || route.routeConfig?.path || '');
    return router.createUrlTree(['/login']);
  }

  // Check if route requires customer profile
  if (requiresCustomer && !customerId) {
    console.log('⚠️  Customer profile required but not found, redirecting to create profile');
    return router.createUrlTree(['/customer/create']);
  }

  // User is authenticated and meets all route requirements
  console.log('✅ Access granted');
  return true;
};