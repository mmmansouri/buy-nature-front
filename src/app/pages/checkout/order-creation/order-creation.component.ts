import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { take, filter, tap } from "rxjs";
import { OrderService } from "../../../services/order.service";
import { Router } from '@angular/router';

/**
 * Order Creation Component - Modern Angular 19+ Implementation
 *
 * Handles the final step of order processing:
 * - Monitors order payment status
 * - Clears cart and order data on success
 * - Provides user feedback
 */
@Component({
    selector: 'app-order-creation',
    imports: [
        MatProgressSpinner,
        MatIcon,
        MatButton
    ],
    templateUrl: './order-creation.component.html',
    styleUrl: './order-creation.component.scss'
})
export class OrderCreationComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Signal for reactive state management
  readonly orderStatus = signal<'loading' | 'success' | 'error'>('loading');

  // Track if cart has been cleared to prevent duplicate clearing
  private cartCleared = false;

  ngOnInit() {
    console.log('📦 Order Creation component initialized');

    // Subscribe to order status changes - wait for 'success' status
    this.orderService.getCurrentOrder().pipe(
      filter(order => !!order && order.paymentStatus === 'success'), // Wait for success status
      take(1), // Complete after first success
      tap(order => console.log('📊 Order payment status:', order?.paymentStatus)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (order) => {
        console.log('✅ Payment successful, clearing cart and order data');
        this.orderStatus.set('success');

        // Clear cart and order data only once
        if (!this.cartCleared) {
          this.cartCleared = true;

          // CRITICAL: Clear localStorage FIRST before any other actions
          console.log('🗑️ Clearing localStorage to prevent cart restoration');
          localStorage.removeItem('appState');

          // Then clear the state via actions
          this.orderService.clearAllOrderData();
          console.log('🧹 Cart and order data cleared from state');
        }
      },
      error: (error) => {
        console.error('❌ Error retrieving order:', error);
        this.orderStatus.set('error');
      }
    });

    // Monitor for failed payments
    this.orderService.getCurrentOrder().pipe(
      filter(order => !!order && order.paymentStatus === 'error'),
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        console.error('❌ Payment failed');
        this.orderStatus.set('error');
      }
    });
  }

  // Navigation methods for user control
  continueToProducts(): void {
    console.log('📦 User navigating to products page');
    this.router.navigate(['/items']);
  }

  viewOrders(): void {
    console.log('📦 User navigating to orders page');
    this.router.navigate(['/customer/orders']);
  }

  goToHome(): void {
    console.log('📦 User navigating to home page');
    this.router.navigate(['/']);
  }
}
