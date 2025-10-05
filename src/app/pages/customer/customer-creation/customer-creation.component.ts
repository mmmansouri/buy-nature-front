import { Component, ViewChild, OnInit, OnDestroy, inject, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CustomerService } from '../../../services/customer.service';
import { CustomerCreationRequest } from '../../../models/customer-creation-request.model';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserAuthService } from "../../../services/user-auth.service";

@Component({
  selector: 'app-customer-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './customer-creation.component.html',
  styleUrl: './customer-creation.component.scss'
})
export class CustomerCreationComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;

  private injector = inject(Injector);

  userForm: FormGroup;
  customerForm: FormGroup;

  userId: string | null = null;
  isLoading = this.userService.getUserLoadingSignal();
  error = this.userService.getUserErrorSignal();
  passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";

  customerCreationLoading = this.userService.getUserLoadingSignal();
  customerCreationError = this.customerService.getCustomerErrorSignal();
  customerCreationSuccess = false;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private customerService: CustomerService,
    private userAuth: UserAuthService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]]
    });

    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      streetNumber: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit() {
    // No initialization needed yet
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  submitUserForm() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const { email, password } = this.userForm.value;
    const userIdSignal = this.userService.createUserSignal(email, password);

    // Run toObservable in injection context
    runInInjectionContext(this.injector, () => {
      const userIdObservable = toObservable(userIdSignal);

      const userSub = userIdObservable.pipe(
        filter(id => !!id),
        take(1)
      ).subscribe(id => {
        this.userId = id;
        this.customerForm.get('email')?.setValue(email);

        setTimeout(() => {
          if (this.stepper) {
            this.stepper.next();
          }
        });
      });

      this.subscriptions.add(userSub);
    });
  }

  submitCustomerForm() {
    if (!this.userId || this.customerForm.invalid) {
      this.markFormGroupTouched(this.customerForm);
      return;
    }

    const customerRequest: CustomerCreationRequest = {
      userId: this.userId,
      ...this.customerForm.value
    };

    const { loading, error, customerId } = this.customerService.createCustomer(customerRequest);

    // Run toObservable in injection context
    runInInjectionContext(this.injector, () => {
      const loadingObservable = toObservable(loading);

      const customerSub = loadingObservable.pipe(
        filter(isLoading => !isLoading),
        take(1)
      ).subscribe(() => {
        if (!error() && customerId()) {
          this.customerCreationSuccess = true;
          // Update the auth service with the new customer ID
          this.userAuth.setCustomerId(customerId()!);
        }
      });

      this.subscriptions.add(customerSub);
    });
  }

  // Helper method to mark all controls as touched for validation styling
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getPasswordErrorMessage(): string {
    if (this.userForm.get('password')?.hasError('required')) {
      return 'Password is required';
    }
    return 'Password must be at least 8 characters and contain at least one digit, lowercase letter, uppercase letter, special character, and no whitespace';
  }
}
