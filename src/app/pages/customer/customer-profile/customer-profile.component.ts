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
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { EditCredentialsDialogComponent } from '../edit-credentials-dialog/edit-credentials-dialog.component';

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
  private dialog = inject(MatDialog);

  // Use the customer ID from auth service
  customer = this.customerService.getCustomerProfileSignal(this.userAuth.customerId()!);
  loading = this.customerService.getCustomerLoadingSignal();
  error = this.customerService.getCustomerErrorSignal();

  /**
   * Format date to readable format
   */
  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  /**
   * Get initials from customer name for avatar
   */
  getInitials(): string {
    const c = this.customer();
    if (!c) return '';
    const first = c.firstName?.charAt(0) || '';
    const last = c.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  /**
   * Get formatted full address
   */
  getFullAddress(): string {
    const c = this.customer();
    if (!c) return '';
    return `${c.streetNumber} ${c.street}, ${c.city}, ${c.region} ${c.postalCode}, ${c.country}`;
  }

  /**
   * Open edit personal information dialog (uses same dialog as address)
   */
  openPersonalInfoDialog(): void {
    const currentCustomer = this.customer();
    if (!currentCustomer) return;

    this.dialog.open(EditProfileDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { customer: currentCustomer },
      disableClose: false,
      panelClass: 'bio-dialog-panel'
    });
    // No need to manually refresh - NgRx store will update automatically
  }

  /**
   * Open edit address dialog
   */
  openEditDialog(): void {
    const currentCustomer = this.customer();
    if (!currentCustomer) return;

    this.dialog.open(EditProfileDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { customer: currentCustomer },
      disableClose: false,
      panelClass: 'bio-dialog-panel'
    });
    // No need to manually refresh - NgRx store will update automatically
  }

  /**
   * Open edit credentials dialog (email & password)
   */
  openCredentialsDialog(): void {
    const currentCustomer = this.customer();
    if (!currentCustomer) return;

    this.dialog.open(EditCredentialsDialogComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: {
        userId: currentCustomer.userId,
        currentEmail: currentCustomer.email
      },
      disableClose: false,
      panelClass: 'bio-dialog-panel'
    });
    // No need to manually refresh - NgRx store will update automatically
  }
}
