import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user.service';

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
    MatButtonModule
  ],
  templateUrl: './customer-creation.component.html',
  styleUrl: './customer-creation.component.scss'
})
export class CustomerCreationComponent {
  userForm: FormGroup;
  isLoading = this.userService.getUserLoadingSignal();
  error = this.userService.getUserErrorSignal();
  passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]]
    });
  }

  submitUserForm() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const { email, password } = this.userForm.value;
    const userId = this.userService.createUserSignal(
      email,
      password
    );

    // You can subscribe to userId signal changes if needed
    // Or implement logic to move to the next step when userId is received
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
