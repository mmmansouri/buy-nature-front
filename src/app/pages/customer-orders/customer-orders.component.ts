import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Order } from '../../models/order.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.scss'
})
export class CustomerOrdersComponent implements OnInit {
  @Input() customerId!: string;

  protected customerService = inject(CustomerService);

  orders: any;
  loading = this.customerService.getCustomerLoadingSignal();
  error = this.customerService.getCustomerErrorSignal();

  ngOnInit(): void {
    // If customerId isn't provided as an input, you might want to get it from another source
    if (!this.customerId) {
      // For demo purposes, using a hardcoded ID
      this.customerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    }

    this.orders = this.customerService.getCustomerOrdersSignal(this.customerId);
  }

  getOrderStatusClass(status: string): string {
    switch(status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'canceled': return 'status-canceled';
      default: return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
