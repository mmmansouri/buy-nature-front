import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CartComponent} from "./cart/cart.component";
import {DeliveryComponent} from "./delivery/delivery.component";
import {MatButtonModule} from "@angular/material/button";
import { DeliveryService } from '../../services/delivery.service';
import { PaymentComponent } from "./payment/payment.component";
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { OrderReviewComponent } from './order-review/order-review.component';
import { StepperService } from '../../services/stepper.service';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {OrderCreationComponent} from "./order-result/order-creation.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    NgIf,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    CartComponent,
    DeliveryComponent,
    MatStepLabel,
    MatButtonModule,
    MatStepperNext,
    MatStepperPrevious,
    PaymentComponent,
    OrderReviewComponent,
    MatProgressSpinner,
    OrderCreationComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;

  cartForm: FormGroup;
  deliveryForm!: FormGroup;
  paymentForm!: FormGroup;
  currentStepIndex: number = 0;

  deliveryConfirmed: boolean = false;

  constructor(
   private router: Router,
   private fb: FormBuilder,
   private deliveryService: DeliveryService,
   private orderService: OrderService,
   private stepperService: StepperService) {
    this.paymentForm = this.fb.group({});
    this.cartForm = this.fb.group({});
    this.deliveryForm = this.fb.group({});
  }


  ngOnInit() {
    this.stepperService.step$.subscribe(index => {
      this.setStep(index);
    });
  }

  onDeliveryConfirmedChange(confirmed: boolean) {
    this.deliveryConfirmed = confirmed;
  }

  onStepChange(event: any): void {
    this.currentStepIndex = event.selectedIndex;
  }

  isPaymentInProgress(): boolean {
    return this.currentStepIndex === 3 && this.paymentComponent?.paying() || false;
  }


  confirmDelivery() {
    if (!this.deliveryConfirmed && this.deliveryForm.valid) {
      const delivery = this.deliveryForm.value;
      this.deliveryService.updateDeliveryDetails(delivery);
    }
  }

  confirmOrder() {
      this.orderService.confirmOrder();
  }

  clearOrder() {
    this.orderService.clearOrder()
  }

  confirmPayment() {
    if (this.paymentComponent) {
      this.paymentComponent.pay().subscribe(success => {
        if (success) {
          this.stepper.next();
        } else {
          //TODO: Handle payment error
        }
      });
    }
  }

  resetStepper(stepper: any): void {
    stepper.reset();
    this.router.navigate(['/items']);
  }

  setStep(index: number): void {
   if(this.stepper && index < this.stepper.selectedIndex) {
    this.stepper.selectedIndex = index;
   }
  }

}
