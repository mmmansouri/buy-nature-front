import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable, of, switchMap, catchError, timer } from 'rxjs';
import { environment } from '../../environments/environment';

interface ClientTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO 8601 timestamp
  tokenType: string;
}

/**
 * Client Authentication Service
 * Handles app-level authentication (Tier 1)
 * This token is used for public APIs that don't require user login
 */
@Injectable({
  providedIn: 'root'
})
export class ClientAuthService {
  private readonly STORAGE_KEY = 'client_token';
  private readonly EXPIRY_KEY = 'client_token_expiry';

  // Use HttpBackend to bypass interceptors (avoid circular dependency)
  private http: HttpClient;
  private apiUrl = `${environment.apiUrl}/auth/client`;

  // State signals
  private clientToken = signal<string | null>(this.getStoredToken());
  private tokenExpiry = signal<number | null>(this.getStoredExpiry());
  private isRefreshing = signal<boolean>(false);

  // Public computed signals
  readonly token = computed(() => this.clientToken());
  readonly isAuthenticated = computed(() => {
    const token = this.clientToken();
    const expiry = this.tokenExpiry();

    if (!token || !expiry) return false;

    // Check if token is still valid (with 1 minute buffer)
    return Date.now() < (expiry - 60000);
  });

  constructor() {
    // Create HttpClient that bypasses interceptors
    const handler = inject(HttpBackend);
    this.http = new HttpClient(handler);

    console.log('🔧 ClientAuthService initialized');

    // Initialize token if needed
    if (!this.isAuthenticated()) {
      console.log('🔑 No valid client token, fetching new one...');
      this.refreshToken().subscribe();
    } else {
      console.log('✅ Valid client token found in storage');
      // Schedule refresh before expiration
      this.scheduleTokenRefresh();
    }
  }

  /**
   * Get a valid client token
   * Returns immediately if token is valid, or fetches a new one
   */
  getValidToken(): Observable<string | null> {
    if (this.isAuthenticated()) {
      return of(this.clientToken());
    }

    if (this.isRefreshing()) {
      // Wait for ongoing refresh to complete
      return this.waitForRefresh();
    }

    return this.refreshToken();
  }

  /**
   * Force token refresh (used when current token is rejected by backend)
   * Clears current token and fetches a new one
   */
  forceRefresh(): Observable<string | null> {
    console.log('🔄 Force refreshing client token...');
    this.clearToken();
    return this.refreshToken();
  }

  /**
   * Refresh the client token
   */
  private refreshToken(): Observable<string | null> {
    this.isRefreshing.set(true);

    return this.http.post<ClientTokenResponse>(`${this.apiUrl}/token`, {
      clientId: environment.clientId,
      clientSecret: environment.clientSecret
    }).pipe(
      switchMap(response => {
        // Backend returns expiresAt as ISO timestamp
        const expiry = new Date(response.expiresAt).getTime();

        // Update signals and storage
        this.clientToken.set(response.accessToken);
        this.tokenExpiry.set(expiry);
        this.storeToken(response.accessToken, expiry);
        this.isRefreshing.set(false);

        // Schedule next refresh
        this.scheduleTokenRefresh();

        return of(response.accessToken);
      }),
      catchError(error => {
        console.error('Client authentication failed:', error);
        this.isRefreshing.set(false);
        this.clearToken();
        return of(null);
      })
    );
  }

  /**
   * Wait for an ongoing token refresh to complete
   */
  private waitForRefresh(): Observable<string | null> {
    return new Observable(observer => {
      const checkInterval = setInterval(() => {
        if (!this.isRefreshing()) {
          clearInterval(checkInterval);
          observer.next(this.clientToken());
          observer.complete();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    });
  }

  /**
   * Schedule automatic token refresh before expiration
   */
  private scheduleTokenRefresh(): void {
    const expiry = this.tokenExpiry();
    if (!expiry) return;

    const now = Date.now();
    const timeUntilExpiry = expiry - now;

    // Refresh 2 minutes before expiration
    const refreshTime = Math.max(0, timeUntilExpiry - 120000);

    timer(refreshTime).pipe(
      switchMap(() => this.refreshToken())
    ).subscribe();
  }

  /**
   * Store token in localStorage
   */
  private storeToken(token: string, expiry: number): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, token);
      localStorage.setItem(this.EXPIRY_KEY, expiry.toString());
    } catch (error) {
      console.error('Failed to store client token:', error);
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
   * Get stored expiry from localStorage
   */
  private getStoredExpiry(): number | null {
    try {
      const expiry = localStorage.getItem(this.EXPIRY_KEY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch {
      return null;
    }
  }

  /**
   * Clear token from memory and storage
   */
  private clearToken(): void {
    this.clientToken.set(null);
    this.tokenExpiry.set(null);

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to clear client token:', error);
    }
  }
}