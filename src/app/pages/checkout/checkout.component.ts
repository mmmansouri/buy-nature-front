import { Component, OnInit, signal, ViewChild, inject, AfterViewInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious } from "@angular/material/stepper";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CartComponent } from "./cart/cart.component";
import { DeliveryComponent } from "./delivery/delivery.component";
import { MatButtonModule } from "@angular/material/button";
import { DeliveryService } from '../../services/delivery.service';
import { PaymentComponent } from "./payment/payment.component";
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderReviewComponent } from './order-review/order-review.component';
import { StepperService } from '../../services/stepper.service';
import { OrderCreationComponent } from "./order-creation/order-creation.component";
import { take, finalize } from "rxjs";
import { UserAuthService } from '../../services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Checkout Component - Modern Angular 18+ Implementation
 *
 * Features:
 * - Signal-based state management
 * - Login redirect at "Confirm Order" step
 * - Automatic step restoration after login
 */
@Component({
    selector: 'app-checkout',
    imports: [
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
export class CheckoutComponent implements OnInit, AfterViewInit {
  private readonly userAuth = inject(UserAuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly deliveryService = inject(DeliveryService);
  private readonly orderService = inject(OrderService);
  private readonly stepperService = inject(StepperService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;

  // Signals for reactive state
  readonly paymentStatus = signal<'pending' | 'success' | 'error'>('pending');
  readonly currentStepIndex = signal<number>(0);
  readonly deliveryConfirmed = signal<boolean>(false);
  readonly initialStepIndex = signal<number>(0);
  readonly isConfirmingOrder = signal<boolean>(false);
  readonly isProcessingPayment = signal<boolean>(false);

  // Forms
  cartForm: FormGroup;
  deliveryForm: FormGroup;
  paymentForm: FormGroup;

  constructor() {
    this.cartForm = this.fb.group({});
    this.deliveryForm = this.fb.group({});
    this.paymentForm = this.fb.group({});

    // Check for saved step BEFORE view initialization to prevent glitch
    const savedStep = sessionStorage.getItem('checkoutStep');
    if (savedStep && this.userAuth.isAuthenticated()) {
      const stepIndex = parseInt(savedStep, 10);
      sessionStorage.removeItem('checkoutStep');
      this.initialStepIndex.set(stepIndex);
      this.currentStepIndex.set(stepIndex);
      console.log('🔄 Initializing stepper at saved step:', stepIndex);
    }
  }

  ngOnInit() {
    // Use takeUntilDestroyed for automatic cleanup
    this.stepperService.step$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(index => {
        this.setStep(index);
      });
  }

  ngAfterViewInit() {
    // If we had a saved step, setup forms to allow navigation
    const initialStep = this.initialStepIndex();
    if (initialStep > 0 && this.stepper) {
      // Mark previous steps as touched to satisfy linear stepper
      this.cartForm.markAllAsTouched();
      this.cartForm.updateValueAndValidity();
      this.deliveryForm.markAllAsTouched();
      this.deliveryForm.updateValueAndValidity();

      // Set the step with linear mode temporarily disabled
      setTimeout(() => {
        if (this.stepper) {
          const wasLinear = this.stepper.linear;
          this.stepper.linear = false;
          this.stepper.selectedIndex = initialStep;
          setTimeout(() => {
            if (this.stepper) {
              this.stepper.linear = wasLinear;
            }
          }, 0);
          console.log('✅ Stepper restored to step:', initialStep);
        }
      }, 0);
    }
  }
  setStep(index: number): void {
    if(this.stepper && index < this.stepper.selectedIndex) {
      this.stepper.selectedIndex = index;
    }
  }

  onDeliveryConfirmedChange(confirmed: boolean) {
    this.deliveryConfirmed.set(confirmed);
  }

  onStepChange(event: any): void {
    this.currentStepIndex.set(event.selectedIndex);
  }

  isPaymentInProgress(): boolean {
    return this.currentStepIndex() === 3 && this.paymentComponent?.paying() || false;
  }

  confirmDelivery() {
    if (!this.deliveryConfirmed() && this.deliveryForm.valid) {
      const delivery = this.deliveryForm.value;
      this.deliveryService.updateDeliveryDetails(delivery);
    }
  }

  /**
   * Confirm order before proceeding to payment
   * Checks if user is authenticated and has a customer profile
   * Prevents duplicate orders with loading state
   */
  confirmOrder() {
    // Prevent multiple clicks
    if (this.isConfirmingOrder()) {
      console.log('⚠️ Order confirmation already in progress');
      return;
    }

    // Check authentication
    if (!this.userAuth.isAuthenticated()) {
      sessionStorage.setItem('returnUrl', 'checkout');
      sessionStorage.setItem('checkoutStep', '2');
      this.showLoginRequired('You must be logged in to place an order');
      return;
    }

    // Check if user has customer profile
    if (!this.userAuth.customerId()) {
      this.showLoginRequired('Please create a customer profile before placing an order');
      this.router.navigate(['/customer/create']);
      return;
    }

    // Set loading state to prevent duplicate submissions
    this.isConfirmingOrder.set(true);

    // User is authenticated and has customer ID - confirm order
    this.orderService.confirmOrder().pipe(
      take(1),
      finalize(() => this.isConfirmingOrder.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (success) => {
        if (success) {
          console.log('✅ Order confirmed, proceeding to payment');
          this.stepper.next();
        }
      },
      error: (error) => {
        console.error('❌ Failed to confirm order:', error);
        this.showLoginRequired('Unable to confirm order. Please log in and try again.');
      }
    });
  }

  /**
   * Show snackbar with message and redirect to login after delay
   */
  private showLoginRequired(message: string): void {
    const snackBarRef = this.snackBar.open(
      message,
      'Login Now',
      {
        duration: 10000, // 10 seconds
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['login-required-snackbar']
      }
    );

    // Redirect to login if user clicks "Login Now" button
    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/login']);
    });

    // Auto-redirect after 3 seconds if user doesn't click
    setTimeout(() => {
      if (!this.userAuth.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    }, 3000);
  }

  confirmPayment() {
    // Prevent multiple payment attempts
    if (this.isProcessingPayment()) {
      console.log('⚠️ Payment already in progress');
      return;
    }

    if (!this.paymentComponent) {
      console.error('❌ Payment component not available');
      return;
    }

    this.isProcessingPayment.set(true);

    // Get current order and process payment
    this.orderService.getCurrentOrder().pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(order => {
      if (order && order.id) {
        // Process the payment
        this.paymentComponent.pay().pipe(
          take(1),
          finalize(() => this.isProcessingPayment.set(false)),
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: (success) => {
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
          },
          error: (error) => {
            console.error('❌ Payment failed:', error);
            if (order.id) {
              this.orderService.handlePaymentFailure(order.id);
            }
            this.paymentStatus.set('error');
          }
        });
      } else {
        console.error('❌ No valid order found');
        this.isProcessingPayment.set(false);
      }
    });
  }

  resetStepper(stepper: any): void {
    stepper.reset();
    this.router.navigate(['/items']);
  }

}
