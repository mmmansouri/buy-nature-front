import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  customerId: number;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {
  private readonly TOKEN_KEY = 'authToken';
  private customerId: number | null = null;

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.customerId = this.extractCustomerId(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCustomerId(): number | null {
    if (this.customerId === null) {
      const token = this.getToken();
      if (token) {
        this.customerId = this.extractCustomerId(token);
      }
    }
    return this.customerId;
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.customerId = null;
  }

  private extractCustomerId(token: string): number | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.customerId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
