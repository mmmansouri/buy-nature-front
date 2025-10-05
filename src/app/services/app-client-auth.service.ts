import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { catchError, map, of, Observable, switchMap, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { AUTH_HTTP_CLIENT } from './http-client.factory';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppClientAuthService {
  // Use direct HttpBackend to avoid interceptors
  private http = inject(AUTH_HTTP_CLIENT);
  private apiUrl = `${environment.apiUrl}/auth/client`;

  // Client credentials from environment
  private clientId = environment.clientId;
  private clientSecret = environment.clientSecret;

  // State management with signals
  private accessToken = signal<string | null>(null);
  private refreshToken = signal<string | null>(null);
  private expiresAt = signal<Date | null>(null);
  private loading = signal<boolean>(false);

  // Public API for consumers
  readonly token = computed(() => this.accessToken());
  readonly isLoading = computed(() => this.loading());
  readonly isAuthenticated = computed(() =>
    !!this.accessToken() && !!this.expiresAt() && this.expiresAt()! > new Date()
  );

  constructor() {
    // Auto initialize on service creation
    this.initialize();

    // Set up token refresh
    effect(() => {
      const expiry = this.expiresAt();
      if (expiry) {
        this.setupRefreshTimer(expiry);
      }
    });
  }

  // Public API - get a valid token
  getToken(): Observable<string | null> {
    if (this.isAuthenticated()) {
      return of(this.accessToken());
    }

    if (this.loading()) {
      return this.waitForCompletion();
    }

    if (this.refreshToken()) {
      return this.refresh();
    }

    return this.authenticate();
  }

  // Initialize authentication
  private initialize(): void {
    this.authenticate().subscribe();
  }

  // Wait for pending auth to complete
  private waitForCompletion(): Observable<string | null> {
    return new Observable<string | null>(observer => {
      const interval = setInterval(() => {
        if (!this.loading()) {
          observer.next(this.accessToken());
          observer.complete();
          clearInterval(interval);
        }
      }, 100);

      // Cleanup on unsubscribe
      return () => clearInterval(interval);
    });
  }

  // Authenticate with client credentials
  private authenticate(): Observable<string | null> {
    this.loading.set(true);

    return this.http.post<TokenResponse>(`${this.apiUrl}/token`, {
      clientId: this.clientId,
      clientSecret: this.clientSecret
    }).pipe(
      map(response => {
        this.updateTokens(response);
        return this.accessToken();
      }),
      catchError(error => {
        console.error('Client authentication failed:', error);
        this.loading.set(false);
        return of(null);
      })
    );
  }

  // Refresh the token
  private refresh(): Observable<string | null> {
    this.loading.set(true);

    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, {
      refreshToken: this.refreshToken()
    }).pipe(
      map(response => {
        this.updateTokens(response);
        return this.accessToken();
      }),
      catchError(() => {
        // On refresh failure, try full authentication
        return this.authenticate();
      })
    );
  }

  // Update token state
  private updateTokens(response: TokenResponse): void {
    this.accessToken.set(response.accessToken);
    this.refreshToken.set(response.refreshToken);
    this.expiresAt.set(new Date(response.expiresAt));
    this.loading.set(false);
  }

  // Set up token refresh before expiration
  private setupRefreshTimer(expiry: Date): void {
    const now = new Date();
    const timeUntilExpiry = expiry.getTime() - now.getTime();

    // Refresh 1 minute before expiration
    const refreshDelay = Math.max(0, timeUntilExpiry - 60000);

    timer(refreshDelay)
      .pipe(switchMap(() => this.refresh()))
      .subscribe();
  }
}
