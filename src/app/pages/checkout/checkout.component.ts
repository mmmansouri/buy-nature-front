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
import {OrderCreationComponent} from "./order-creation/order-creation.component";
import {take} from "rxjs";

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
    OrderCreationComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;
  paymentStatus = signal<'pending' | 'success' | 'error'>('pending');

  cartForm: FormGroup;
  deliveryForm!: FormGroup;
  paymentForm!: FormGroup;
  currentStepIndex: number = 0;
  paymentComponentReady = false;

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
  setStep(index: number): void {
    if(this.stepper && index < this.stepper.selectedIndex) {
      this.stepper.selectedIndex = index;
    }
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
    this.stepper.next();
  }

  confirmPayment() {
    if (this.paymentComponent) {
      // First, dispatch that we're starting payment process
      this.orderService.getCurrentOrder().pipe(
        take(1)
      ).subscribe(order => {
        if (order && order.id) {
          // Process the payment
          this.paymentComponent.pay().subscribe(success => {
            if (success) {
              // On success, dispatch payment success action
              this.orderService.handlePaymentSuccess(order.id!);
              this.paymentStatus.set('success');
              this.stepper.next();
            } else {
              // On failure, dispatch payment failure action
              this.orderService.handlePaymentFailure(order.id!);
              this.paymentStatus.set('error');
            }
          });
        }
      });
    }
  }

  resetStepper(stepper: any): void {
    stepper.reset();
    this.router.navigate(['/items']);
  }

}
