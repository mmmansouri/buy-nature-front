import {Component, inject, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Customer} from '../../../models/customer.model';
import {CustomerService} from '../../../services/customer.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

export interface EditProfileDialogData {
  customer: Customer;
}

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrl: './edit-profile-dialog.component.scss'
})
export class EditProfileDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditProfileDialogComponent>);
  readonly data = inject<EditProfileDialogData>(MAT_DIALOG_DATA);
  readonly customerService = inject(CustomerService);
  private fb = inject(FormBuilder);

  profileForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.profileForm = this.fb.group({
      firstName: [this.data.customer.firstName, [Validators.required]],
      lastName: [this.data.customer.lastName, [Validators.required]],
      phoneNumber: [this.data.customer.phoneNumber, [Validators.required]],
      streetNumber: [this.data.customer.streetNumber, [Validators.required]],
      street: [this.data.customer.street, [Validators.required]],
      city: [this.data.customer.city, [Validators.required]],
      region: [this.data.customer.region, [Validators.required]],
      postalCode: [this.data.customer.postalCode, [Validators.required]],
      country: [this.data.customer.country, [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.profileForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const updates = this.profileForm.value;
      this.customerService.updateCustomerProfile(this.data.customer.id, updates);

      // Close dialog after dispatching action
      setTimeout(() => {
        this.loading.set(false);
        this.dialogRef.close(true);
      }, 500);
    }
  }
}
