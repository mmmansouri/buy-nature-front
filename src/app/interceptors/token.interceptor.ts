import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, catchError, throwError } from 'rxjs';
import { ClientAuthService } from '../services/client-auth.service';
import { UserAuthService } from '../services/user-auth.service';

/**
 * Token Interceptor
 * Handles two-tier authentication by adding appropriate tokens to HTTP requests
 *
 * Token Strategy:
 * 1. Client Token (Tier 1): Always added to requests for app-level auth
 * 2. User Token (Tier 2): Added to requests for authenticated users
 *
 * Priority: User token takes precedence when both are available
 *
 * Error Handling:
 * - 401/403 on user-protected endpoints → Redirect to login
 * - 401/403 on client-protected endpoints → Refresh client token and retry
 */
export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Skip interceptor for client authentication endpoint (prevent circular dependency)
  if (req.url.includes('/auth/client/token')) {
    console.log('⚪ Skipping interceptor for client token request');
    return next(req);
  }

  const clientAuth = inject(ClientAuthService);
  const userAuth = inject(UserAuthService);
  const router = inject(Router);

  const userToken = userAuth.token();
  const isUserAuthenticated = userAuth.isAuthenticated();

  console.log('🔐 Token Interceptor:', {
    url: req.url,
    isUserAuthenticated,
    hasUserToken: !!userToken
  });

  // Determine if this is a user-protected endpoint
  const isUserProtectedEndpoint =
    req.url.includes('/customers') ||
    req.url.includes('/orders/customer') ||
    req.url.includes('/user');

  // Strategy: Determine which token(s) to use
  if (isUserAuthenticated && userToken) {
    // User is logged in: use user token (includes both app and user auth)
    console.log('👤 Using user token');
    const authReq = addAuthHeader(req, userToken);
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 403) && isUserProtectedEndpoint) {
          console.error('🚫 User authentication failed - redirecting to login');
          userAuth.logout();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // User not logged in: use client token for public API access
  console.log('🔑 Fetching client token...');
  return clientAuth.getValidToken().pipe(
    switchMap(clientToken => {
      if (clientToken) {
        console.log('✅ Client token obtained, adding to request');
        const authReq = addAuthHeader(req, clientToken);
        return next(authReq).pipe(
          catchError((error: HttpErrorResponse) => {
            // Handle auth errors differently based on endpoint type
            if (error.status === 401 || error.status === 403) {
              if (isUserProtectedEndpoint) {
                // User endpoint → redirect to login
                console.error('🚫 User authentication required - redirecting to login');
                router.navigate(['/login']);
                return throwError(() => error);
              } else {
                // Client endpoint → refresh token and retry
                console.warn('🔄 Client token expired, refreshing and retrying...');
                return handleClientTokenRefreshAndRetry(req, next, clientAuth);
              }
            }
            return throwError(() => error);
          })
        );
      }

      console.warn('⚠️  No token available - proceeding without authentication');
      return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if ((error.status === 401 || error.status === 403) && isUserProtectedEndpoint) {
            console.error('🚫 Authentication required - redirecting to login');
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }),
    catchError(error => {
      console.error('❌ Token interceptor error:', error);
      return throwError(() => error);
    })
  );
};

/**
 * Handle client token refresh and retry the request
 * This ensures API calls with expired client tokens automatically retry with a fresh token
 */
function handleClientTokenRefreshAndRetry(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  clientAuth: ClientAuthService
) {
  // Force refresh (clears current token and gets new one)
  return clientAuth.forceRefresh().pipe(
    switchMap(newToken => {
      if (!newToken) {
        console.error('❌ Failed to refresh client token');
        return throwError(() => new Error('Client authentication failed'));
      }

      console.log('✅ Client token refreshed, retrying request');
      const retryReq = addAuthHeader(req, newToken);
      return next(retryReq);
    }),
    catchError(error => {
      console.error('❌ Token refresh failed:', error);
      return throwError(() => error);
    })
  );
}

/**
 * Helper function to add Authorization header to request
 */
function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}