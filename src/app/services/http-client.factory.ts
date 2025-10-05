import { HttpBackend, HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export const AUTH_HTTP_CLIENT = new InjectionToken<HttpClient>('AUTH_HTTP_CLIENT');

export function createAuthHttpClient(handler: HttpBackend) {
  // Creates an HttpClient that bypasses all interceptors
  return new HttpClient(handler);
}
