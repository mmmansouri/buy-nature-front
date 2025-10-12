import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../../models/order.model';

/**
 * Customer Orders Component - Modern Angular 19+ Implementation
 *
 * Features:
 * - Signal-based state management
 * - Displays order history with dates and totals
 * - Links to order details page
 */
@Component({
    selector: 'app-customer-orders',
    imports: [
        CommonModule,
        RouterLink,
        MatProgressSpinnerModule,
        MatCardModule,
        MatDividerModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        CurrencyPipe
    ],
    templateUrl: './customer-orders.component.html',
    styleUrl: './customer-orders.component.scss'
})
export class CustomerOrdersComponent {
  protected customerService = inject(CustomerService);
  protected userAuth = inject(UserAuthService);

  // Use the customer ID from auth service - sorted by most recent
  orders = this.customerService.getCustomerOrdersSignal(this.userAuth.customerId()!);
  loading = this.customerService.getCustomerLoadingSignal();
  error = this.customerService.getCustomerErrorSignal();

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
   * Uses Intl.DateTimeFormat for modern date formatting
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
   * Format date to short format for compact display
   */
  formatShortDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  /**
   * Format date with time for order display
   * Shows date and time in compact format
   */
  formatDateWithTime(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Format only the date part for pretty display
   * Example: "Jan 15, 2025"
   */
  formatDatePart(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  /**
   * Format only the time part for pretty display
   * Example: "2:30 PM"
   */
  formatTimePart(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  /**
   * Format order ID to readable format
   * Takes last 8 characters and formats them nicely
   */
  formatOrderId(orderId: string): string {
    const shortId = orderId.slice(-8).toUpperCase();
    // Insert dash for readability: ABCD-EFGH
    return `${shortId.slice(0, 4)}-${shortId.slice(4)}`;
  }

  /**
   * Format status for display
   * Converts backend status to user-friendly text
   */
  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PAYMENT_CONFIRMED': 'Confirmed',
      'PAYMENT_PROCESSING': 'Processing',
      'PAYMENT_FAILED': 'Failed',
      'PENDING': 'Pending',
      'COMPLETED': 'Completed',
      'SHIPPED': 'Shipped',
      'CANCELED': 'Canceled'
    };

    return statusMap[status?.toUpperCase()] || status;
  }

  /**
   * Calculate total from order items as fallback
   * Used when backend doesn't provide total
   */
  calculateTotal(order: Order): string {
    if (!order.orderItems || order.orderItems.length === 0) {
      return '$0.00';
    }

    const total = order.orderItems.reduce(
      (sum, item) => sum + (item.item.price * item.quantity),
      0
    );

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(total);
  }

  /**
   * Get the most expensive item from an order
   * Used to display as the main highlighted item
   */
  getMostExpensiveItem(order: Order) {
    if (!order.orderItems || order.orderItems.length === 0) {
      return null;
    }

    return order.orderItems.reduce((max, item) =>
      item.item.price > max.item.price ? item : max
    );
  }

  /**
   * Get remaining items (excluding the most expensive)
   */
  getRemainingItems(order: Order) {
    if (!order.orderItems || order.orderItems.length <= 1) {
      return [];
    }

    const mostExpensive = this.getMostExpensiveItem(order);
    return order.orderItems.filter(item => item !== mostExpensive);
  }

  /**
   * Get sorted orders by most recent date
   */
  getSortedOrders() {
    const ordersList = this.orders();
    if (!ordersList || ordersList.length === 0) {
      return [];
    }

    return [...ordersList].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Most recent first
    });
  }
}
