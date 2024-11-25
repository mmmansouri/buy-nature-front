import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    NgIf,
    MatFormField,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    MatInput,
    MatButton
  ],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent {
  @Input()
  deliveryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form
    this.deliveryForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: ['', Validators.required],
        number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        region: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.deliveryForm.valid) {
      console.log('Delivery Details:', this.deliveryForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
