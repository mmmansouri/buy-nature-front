import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, catchError, tap, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

interface UserTokenPayload {
  sub: string; // email (subject is email in backend)
  user_id: string; // Actual user UUID
  email: string;
  customer_id?: string; // Customer UUID (optional)
  role: string; // User role (ADMIN, CUSTOMER, etc.)
  exp: number;
  iat: number;
  iss: string; // issuer
}

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  token: string;
}

export interface UserAuthState {
  isAuthenticated: boolean;
  userId: string | null;
  customerId: string | null;
  email: string | null;
}

/**
 * User Authentication Service
 * Handles user-level authentication (Tier 2)
 * This token is used for protected APIs that require user login
 */
@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private readonly STORAGE_KEY = 'user_token';

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // State signals
  private userToken = signal<string | null>(this.getStoredToken());
  private authState = signal<UserAuthState>(this.initializeAuthState());
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  // Public computed signals
  readonly token = computed(() => this.userToken());
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly userId = computed(() => this.authState().userId);
  readonly customerId = computed(() => this.authState().customerId);
  readonly email = computed(() => this.authState().email);
  readonly isLoading = computed(() => this.loading());
  readonly authError = computed(() => this.error());

  constructor() {
    // Restore auth state from stored token on initialization
    const token = this.userToken();
    if (token) {
      this.updateAuthStateFromToken(token);
    }
  }

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<boolean> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.setUserToken(response.token);
        this.loading.set(false);
      }),
      switchMap(() => of(true)),
      catchError(error => {
        this.loading.set(false);
        this.error.set(error?.error?.message || 'Login failed');
        return of(false);
      })
    );
  }

  /**
   * Register a new user
   */
  register(email: string, password: string, additionalData?: any): Observable<boolean> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      email,
      password,
      ...additionalData
    }).pipe(
      tap(response => {
        this.setUserToken(response.token);
        this.loading.set(false);
      }),
      switchMap(() => of(true)),
      catchError(error => {
        this.loading.set(false);
        this.error.set(error?.error?.message || 'Registration failed');
        return of(false);
      })
    );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.clearUserToken();
    this.router.navigate(['/']);
  }

  /**
   * Update customerId after customer profile is created
   * This updates the auth state without requiring a new login
   */
  setCustomerId(customerId: string): void {
    const currentState = this.authState();
    this.authState.set({
      ...currentState,
      customerId
    });
  }

  /**
   * Clear any auth errors
   */
  clearError(): void {
    this.error.set(null);
  }

  /**
   * Set user token and update auth state
   */
  private setUserToken(token: string): void {
    this.userToken.set(token);
    this.storeToken(token);
    this.updateAuthStateFromToken(token);
    this.navigateAfterLogin();
  }

  /**
   * Clear user token and reset auth state
   */
  private clearUserToken(): void {
    this.userToken.set(null);
    this.removeStoredToken();
    this.authState.set({
      isAuthenticated: false,
      userId: null,
      customerId: null,
      email: null
    });
  }

  /**
   * Update auth state from JWT token
   */
  private updateAuthStateFromToken(token: string): void {
    try {
      const decoded = jwtDecode<UserTokenPayload>(token);

      console.log('🔓 JWT Token decoded:', {
        userId: decoded.user_id,
        customerId: decoded.customer_id || 'NOT SET',
        email: decoded.email,
        role: decoded.role
      });

      this.authState.set({
        isAuthenticated: true,
        userId: decoded.user_id,
        customerId: decoded.customer_id || null,
        email: decoded.email
      });

      console.log('✅ Auth state updated:', this.authState());
    } catch (error) {
      console.error('❌ Failed to decode user token:', error);
      this.clearUserToken();
    }
  }

  /**
   * Initialize auth state from stored token
   */
  private initializeAuthState(): UserAuthState {
    const token = this.getStoredToken();

    if (!token) {
      return {
        isAuthenticated: false,
        userId: null,
        customerId: null,
        email: null
      };
    }

    try {
      const decoded = jwtDecode<UserTokenPayload>(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        this.removeStoredToken();
        return {
          isAuthenticated: false,
          userId: null,
          customerId: null,
          email: null
        };
      }

      return {
        isAuthenticated: true,
        userId: decoded.user_id,
        customerId: decoded.customer_id || null,
        email: decoded.email
      };
    } catch {
      this.removeStoredToken();
      return {
        isAuthenticated: false,
        userId: null,
        customerId: null,
        email: null
      };
    }
  }

  /**
   * Navigate user after successful login
   */
  private navigateAfterLogin(): void {
    const state = this.authState();

    // Check if there's a stored return URL from auth guard
    const returnUrl = sessionStorage.getItem('returnUrl');

    if (returnUrl) {
      // Clear the stored URL and navigate to it
      sessionStorage.removeItem('returnUrl');
      console.log('🔄 Redirecting to stored URL:', returnUrl);
      this.router.navigateByUrl(`/${returnUrl}`);
      return;
    }

    // Default navigation logic
    if (state.customerId) {
      this.router.navigate(['/customer/profile']);
    } else if (state.isAuthenticated) {
      this.router.navigate(['/customer/create']);
    }
  }

  /**
   * Store token in localStorage
   */
  private storeToken(token: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, token);
    } catch (error) {
      console.error('Failed to store user token:', error);
    }
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Remove token from localStorage
   */
  private removeStoredToken(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove user token:', error);
    }
  }
}