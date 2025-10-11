import { Component, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerService } from '../../../services/customer.service';
import { CustomerCreationRequest } from '../../../models/customer-creation-request.model';

@Component({
  selector: 'app-customer-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './customer-creation.component.html',
  styleUrl: './customer-creation.component.scss'
})
export class CustomerCreationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private router = inject(Router);

  // Form group with all fields
  customerForm: FormGroup;

  // Password validation pattern
  private readonly passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";

  // Signals for reactive state
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Password visibility toggle
  hidePassword = signal(true);

  constructor() {
    // Initialize form with all fields in one group
    this.customerForm = this.fb.group({
      // Account credentials
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]],

      // Personal information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],

      // Address information
      streetNumber: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Component initialization if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Submit the complete customer creation form
   * Creates both user and customer in a single backend call
   */
  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.markFormGroupTouched(this.customerForm);
      return;
    }

    // Reset states
    this.error.set(null);
    this.loading.set(true);

    // Build the request object
    const customerRequest: CustomerCreationRequest = {
      firstName: this.customerForm.value.firstName,
      lastName: this.customerForm.value.lastName,
      password: this.customerForm.value.password,
      email: this.customerForm.value.email,
      phoneNumber: this.customerForm.value.phoneNumber,
      streetNumber: this.customerForm.value.streetNumber,
      street: this.customerForm.value.street,
      city: this.customerForm.value.city,
      region: this.customerForm.value.region,
      postalCode: this.customerForm.value.postalCode,
      country: this.customerForm.value.country
    };

    // Dispatch the creation action
    const { loading, error, customerId } = this.customerService.createCustomer(customerRequest);

    // Set up effect to monitor creation status
    effect(() => {
      const isLoading = loading();
      const errorMsg = error();
      const id = customerId();

      if (!isLoading) {
        if (errorMsg) {
          // Handle error
          this.loading.set(false);
          this.error.set(errorMsg);
        } else if (id) {
          // Success - redirect to login
          this.loading.set(false);
          this.successMessage.set('Account created successfully! Please log in.');

          // Navigate to login after a short delay to show success message
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { registered: 'true' }
            });
          }, 1500);
        }
      }
    }, { allowSignalWrites: true });
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  /**
   * Get appropriate error message for password field
   */
  getPasswordErrorMessage(): string {
    const passwordControl = this.customerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Password must be at least 8 characters and contain at least one digit, lowercase letter, uppercase letter, special character, and no whitespace';
    }
    return '';
  }

  /**
   * Get error message for email field
   */
  getEmailErrorMessage(): string {
    const emailControl = this.customerForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  /**
   * Helper method to mark all controls as touched for validation styling
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}