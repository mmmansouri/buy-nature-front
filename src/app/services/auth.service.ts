import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of, tap, Observable, delay, switchMap, from } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { TokenManagerService } from './token-manager.service';
import { environment } from '../../environments/environment';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    userId: string | null;
    customerId: string | null;
    email: string | null;
  };
  loading: boolean;
  error: string | null;
}

interface AuthResponse {
  token: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenManager = inject(TokenManagerService);

  // Base API URL
  private apiUrl = environment.apiUrl;

  // Internal authentication state
  private authState = signal<AuthState>({
    isAuthenticated: false,
    user: {
      userId: null,
      customerId: null,
      email: null
    },
    loading: false,
    error: null
  });

  // Public readonly signals
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly userId = computed(() => this.authState().user.userId);
  readonly customerId = computed(() => this.authState().user.customerId);
  readonly userEmail = computed(() => this.authState().user.email);
  readonly loading = computed(() => this.authState().loading);
  readonly error = computed(() => this.authState().error);

  constructor() {
    // Restore auth state based on existing token
    this.restoreAuthState();

    // Set up token change monitoring
    effect(() => {
      // When user token changes, update auth state
      const userToken = this.tokenManager.getToken();
      if (userToken && !this.isAuthenticated()) {
        this.handleAuthFromToken(userToken);
      } else if (!userToken && this.isAuthenticated()) {
        this.clearAuthState();
      }
    });
  }

  login(email: string, password: string): Observable<boolean> {
    this.authState.update(state => ({ ...state, loading: true, error: null }));

    // Ensure we have a client token first
    return of(this.tokenManager.getToken()).pipe(
      switchMap(clientToken => {
        if (!clientToken) {
          this.authState.update(state => ({
            ...state,
            loading: false,
            error: 'Client authentication failed'
          }));
          return of(false);
        }

        // For now use mock login, but structure for real API
        return this.mockLogin(email, password).pipe(
          tap(response => {
            if (response && response.token) {
              // Set the user token in token manager
              this.tokenManager.setToken(response.token);

              // Update auth state
              this.handleAuthFromToken(response.token);
              return true;
            } else {
              this.authState.update(state => ({
                ...state,
                loading: false,
                error: 'Invalid credentials'
              }));
              return false;
            }
          }),
          catchError(error => {
            this.authState.update(state => ({
              ...state,
              loading: false,
              error: error?.error?.message || 'Authentication failed'
            }));
            return of(false);
          })
        );

        // Real implementation would be:
        // return this.http.post<{token: string}>(`${this.apiUrl}/auth/login`, { email, password })
      }),
      map(result => !!result)
    );
  }

  register(userDetails: any): Observable<boolean> {
    this.authState.update(state => ({ ...state, loading: true, error: null }));

    // Ensure we have a client token first
    return of(this.tokenManager.getToken()).pipe(
      switchMap(clientToken => {
        if (!clientToken) {
          this.authState.update(state => ({
            ...state,
            loading: false,
            error: 'Client authentication failed'
          }));
          return of(false);
        }

        // For now use mock register
        return this.mockRegister(userDetails).pipe(
          tap(response => {
            if (response && response.token) {
              // Set the user token in token manager
              this.tokenManager.setToken(response.token);

              // Update auth state
              this.handleAuthFromToken(response.token);
              return true;
            } else {
              this.authState.update(state => ({
                ...state,
                loading: false,
                error: 'Registration failed'
              }));
              return false;
            }
          }),
          catchError(error => {
            this.authState.update(state => ({
              ...state,
              loading: false,
              error: error?.error?.message || 'Registration failed'
            }));
            return of(false);
          })
        );

        // Real implementation would be:
        // return this.http.post<{token: string}>(`${this.apiUrl}/auth/register`, userDetails)
      }),
      map(result => !!result)
    );
  }

  logout(): void {
    // Clear user token in manager
    this.tokenManager.clearToken();

    // Clear local auth state
    this.clearAuthState();

    // Redirect to home
    this.router.navigate(['/']);
  }

  // For customer creation flow - call this after customer is created
  setCustomerId(customerId: string): void {
    this.authState.update(state => ({
      ...state,
      user: {
        ...state.user,
        customerId
      }
    }));
  }

  // Private methods
  private handleAuthFromToken(token: string): void {
    try {
      // Decode the JWT token
      const decodedToken: any = jwtDecode(token);

      // Extract user data from token
      const userId = decodedToken.sub || decodedToken.userId;
      const customerId = decodedToken.customerId;
      const email = decodedToken.email;

      // Update auth state
      this.authState.set({
        isAuthenticated: true,
        user: {
          userId,
          customerId,
          email
        },
        loading: false,
        error: null
      });

      // Navigate based on user state if needed
      if (customerId) {
        this.router.navigate(['/customer/profile']);
      } else {
        this.router.navigate(['/customer/create']);
      }
    } catch (error) {
      console.error('Error processing JWT token', error);
      this.authState.update(state => ({
        ...state,
        loading: false,
        error: 'Invalid authentication token'
      }));
    }
  }

  private clearAuthState(): void {
    this.authState.set({
      isAuthenticated: false,
      user: {
        userId: null,
        customerId: null,
        email: null
      },
      loading: false,
      error: null
    });
  }

  private restoreAuthState(): void {
    const token = this.tokenManager.getToken();
    if (token) {
      this.handleAuthFromToken(token);
    }
  }

  // Mock methods - replace with real API calls
  private mockLogin(email: string, password: string): Observable<AuthResponse | null> {
    if (email && password) {
      const mockToken = this.createMockJwt({
        sub: 'user-123',
        email,
        customerId: email.includes('test') ? 'customer-456' : null
      });

      return of({ token: mockToken }).pipe(delay(800));
    }

    return of(null).pipe(delay(800));
  }

  private mockRegister(userDetails: any): Observable<AuthResponse | null> {
    const mockToken = this.createMockJwt({
      sub: `user-${Date.now()}`,
      email: userDetails.email,
      customerId: null
    });

    return of({ token: mockToken, userId: `user-${Date.now()}` }).pipe(delay(800));
  }

  private createMockJwt(claims: any): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Date.now() / 1000;
    const payload = {
      ...claims,
      iat: now,
      exp: now + 3600 // Token expires in 1 hour
    };

    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));
    const signature = "MOCK_SIGNATURE";

    return `${base64Header}.${base64Payload}.${signature}`;
  }
}
