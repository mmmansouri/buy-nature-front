import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.scss'
})
export class CustomerProfileComponent implements OnInit {
  @Input() customerId!: string;

  protected customerService = inject(CustomerService);

  customer = this.customerService.getCustomerProfileSignal(this.customerId);
  loading = this.customerService.getCustomerLoadingSignal();
  error = this.customerService.getCustomerErrorSignal();

  ngOnInit(): void {
    if (!this.customerId) {
      // For demo purposes, using a hardcoded ID
      this.customerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      this.customer = this.customerService.getCustomerProfileSignal(this.customerId);
    }
  }

  formatDate(date: string | Date): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }
}
