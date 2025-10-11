import { Component, OnInit, signal, inject, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { take, filter, tap, delay } from "rxjs";
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
        MatProgressSpinner
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
        console.log('✅ Payment successful, clearing cart and order data IMMEDIATELY');
        this.orderStatus.set('success');

        // Clear cart and order data only once
        if (!this.cartCleared) {
          this.cartCleared = true;

          // CRITICAL: Clear localStorage FIRST before any other actions
          console.log('🗑️ Clearing localStorage immediately to prevent cart restoration');
          localStorage.removeItem('appState');

          // Then clear the state via actions
          this.orderService.clearAllOrderData();
          console.log('🧹 Cart and order data cleared from state');

          // Redirect after a short delay
          setTimeout(() => {
            console.log('↗️ Redirecting to items page');
            this.router.navigate(['/items']);
          }, 1000);
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
}
