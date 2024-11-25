import { Component } from '@angular/core';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CartComponent} from "../cart/cart.component";
import {DeliveryComponent} from "../delivery/delivery.component";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    CartComponent,
    DeliveryComponent,
    MatStepLabel,
    MatButton,
    MatStepperNext,
    MatStepperPrevious
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  cartForm: FormGroup;
  deliveryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Cart Form (Validate that the cart is not empty)
    this.cartForm = this.fb.group({
      items: [null, Validators.required] // Dummy control for validation
    });

    // Delivery Form
    this.deliveryForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: ['', Validators.required],
        number: ['', Validators.required],
        region: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  resetStepper(stepper: any): void {
    stepper.reset();
  }

}
