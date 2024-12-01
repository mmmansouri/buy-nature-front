import { Component, Inject } from '@angular/core';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CartComponent} from "../cart/cart.component";
import {DeliveryComponent} from "../delivery/delivery.component";
import {MatButton} from "@angular/material/button";
import { CartService } from '../../services/cart.service';
import { DeliveryService } from '../../services/delivery.service';

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
  deliveryForm!: FormGroup;

  constructor(private fb: FormBuilder, @Inject(CartService) private cartService: CartService, @Inject(DeliveryService) private deliveryService: DeliveryService) {
    // Cart Form (Validate that the cart is not empty)
    this.cartForm = this.fb.group({
      items: [this.cartService.getCartItems(), Validators.required] // Initialize with cart items
    });

    // Delivery Form
    this.deliveryService.getDeliveryDetails().subscribe(deliveryState => {
      this.deliveryForm = this.fb.group({
        firstname: [deliveryState.firstname, Validators.required],
        lastname: [deliveryState.lastname, Validators.required],
        phone: [deliveryState.phone, Validators.required],
        email: [deliveryState.email, [Validators.required, Validators.email]],
        address: this.fb.group({
          street: [deliveryState.address.street, Validators.required],
          number: [deliveryState.address.number, Validators.required],
          region: [deliveryState.address.region, Validators.required],
          country: [deliveryState.address.country, Validators.required],
        }),
      });
    });
  }

  confirmDelivery() {
    this.deliveryService.updateDeliveryDetails(this.deliveryForm.value);
  }

  resetStepper(stepper: any): void {
    //stepper.reset();
  }

}
