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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {Store} from '@ngrx/store';
import * as UserActions from '../../../store/user/user.actions';
import {selectUserLoading, selectUserError} from '../../../store/user/user.selectors';

export interface EditCredentialsDialogData {
  userId: string;
  currentEmail: string;
}

@Component({
  selector: 'app-edit-credentials-dialog',
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
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  templateUrl: './edit-credentials-dialog.component.html',
  styleUrl: './edit-credentials-dialog.component.scss'
})
export class EditCredentialsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditCredentialsDialogComponent>);
  readonly data = inject<EditCredentialsDialogData>(MAT_DIALOG_DATA);
  private store = inject(Store);
  private fb = inject(FormBuilder);

  emailForm: FormGroup;
  passwordForm: FormGroup;
  loading = this.store.selectSignal(selectUserLoading);
  error = this.store.selectSignal(selectUserError);
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor() {
    this.emailForm = this.fb.group({
      email: [this.data.currentEmail, [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): {[key: string]: boolean} | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdateEmail(): void {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email')?.value;
      this.store.dispatch(UserActions.updateUserEmail({
        userId: this.data.userId,
        email
      }));

      // Close dialog after a short delay to show loading state
      setTimeout(() => {
        this.dialogRef.close(true);
      }, 1000);
    }
  }

  onUpdatePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.store.dispatch(UserActions.updateUserPassword({
        userId: this.data.userId,
        currentPassword,
        newPassword
      }));

      // Close dialog after a short delay to show loading state
      setTimeout(() => {
        this.dialogRef.close(true);
      }, 1000);
    }
  }

  getPasswordErrorMessage(): string {
    const newPassword = this.passwordForm.get('newPassword');
    if (newPassword?.hasError('required')) {
      return 'Password is required';
    }
    if (newPassword?.hasError('pattern')) {
      return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    return '';
  }
}
