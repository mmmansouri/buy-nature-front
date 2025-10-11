import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-customer-profile',
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
export class CustomerProfileComponent {
  protected customerService = inject(CustomerService);
  protected userAuth = inject(UserAuthService);

  // Use the customer ID from auth service
  customer = this.customerService.getCustomerProfileSignal(this.userAuth.customerId()!);
  loading = this.customerService.getCustomerLoadingSignal();
  error = this.customerService.getCustomerErrorSignal();

  formatDate(date: string | Date): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }
}
