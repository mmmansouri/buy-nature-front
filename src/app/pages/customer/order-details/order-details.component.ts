import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CustomerService } from '../../../services/customer.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { Order } from '../../../models/order.model';

/**
 * Order Details Component - Modern Angular 19+ Implementation
 *
 * Features:
 * - Signal-based reactive state management
 * - Computed properties for derived state
 * - Modern route parameter handling with signals
 * - Comprehensive order information display
 */
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly userAuth = inject(UserAuthService);

  // Signals for reactive state
  readonly orderId = signal<string | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Get orders from customer service
  readonly orders = this.customerService.getCustomerOrdersSignal(this.userAuth.customerId()!);

  // Computed signal for current order
  readonly order = computed<Order | null>(() => {
    const id = this.orderId();
    const ordersList = this.orders();

    if (!id || !ordersList || ordersList.length === 0) {
      return null;
    }

    return ordersList.find(o => o.id === id) || null;
  });

  // Computed signal for order total
  readonly orderTotal = computed(() => {
    const currentOrder = this.order();
    if (!currentOrder) return 0;

    if (currentOrder.total) {
      return currentOrder.total;
    }

    // Calculate from items as fallback
    return currentOrder.orderItems.reduce(
      (sum, item) => sum + (item.item.price * item.quantity),
      0
    );
  });

  // Computed signal for order subtotal (items only)
  readonly subtotal = computed(() => {
    const currentOrder = this.order();
    if (!currentOrder || !currentOrder.orderItems) return 0;

    return currentOrder.orderItems.reduce(
      (sum, item) => sum + (item.item.price * item.quantity),
      0
    );
  });

  ngOnInit() {
    // Get order ID from route params
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No order ID provided');
      this.loading.set(false);
      return;
    }

    this.orderId.set(id);
    this.loading.set(false);

    // Check if order exists
    if (!this.order()) {
      console.warn('Order not found:', id);
      this.error.set('Order not found');
    }
  }

  /**
   * Get CSS class for order status badge
   */
  getOrderStatusClass(status: string): string {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'payment_confirmed':
        return 'status-completed';
      case 'processing':
      case 'payment_processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'canceled':
      case 'payment_failed':
        return 'status-canceled';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  /**
   * Format date to readable format
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Format date to short format
   */
  formatShortDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  /**
   * Go back to orders list
   */
  goBack(): void {
    this.router.navigate(['/customer/orders']);
  }

  /**
   * Print order (to be implemented)
   */
  printOrder(): void {
    window.print();
  }
}
