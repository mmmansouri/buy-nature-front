import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {Observable} from "rxjs";
import {ShippingAddress} from "../../../models/shipping-address.model";
import { DeliveryService } from '../../../services/delivery.service';


@Component({
    selector: 'app-delivery',
    imports: [
        NgIf,
        MatFormField,
        MatLabel,
        MatError,
        ReactiveFormsModule,
        MatInput
    ],
    templateUrl: './delivery.component.html',
    styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  delivery$: Observable<ShippingAddress>;

  @Input() formGroup!: FormGroup;
  @Output() deliveryConfirmedChange = new EventEmitter<boolean>();

  private deliveryDetails!: ShippingAddress;

  constructor(private deliveryService: DeliveryService,private fb: FormBuilder) {
    this.delivery$ = this.deliveryService.getDeliveryDetails();

  }
  ngOnInit() {
    // Ensure the formGroup exists
    if (!this.formGroup) {
      throw new Error('Parent formGroup must be passed to DeliveryComponent');
    }

    // Add controls to the existing formGroup
    this.formGroup.addControl('firstName', this.fb.control('', [Validators.required, Validators.minLength(2)]));
    this.formGroup.addControl('lastName', this.fb.control('', [Validators.required, Validators.minLength(2)]));
    this.formGroup.addControl('phoneNumber', this.fb.control('', [
      Validators.required,
      Validators.pattern('^(\\+33|0)[1-9](\\d{2}){4}$') // French phone number format
    ]));
    this.formGroup.addControl('email', this.fb.control('', [Validators.required, Validators.email]));
    this.formGroup.addControl('streetNumber', this.fb.control('', Validators.required));
    this.formGroup.addControl('street', this.fb.control('', Validators.required));
    this.formGroup.addControl('city', this.fb.control('', Validators.required));
    this.formGroup.addControl('region', this.fb.control('', Validators.required));
    this.formGroup.addControl('postalCode', this.fb.control('', Validators.required));
    this.formGroup.addControl('country', this.fb.control('', Validators.required));

    // Subscribe to delivery$ to prefill form values
    this.delivery$.subscribe(delivery => {
      if (delivery) {
        this.deliveryDetails = delivery;
        this.formGroup.patchValue(delivery);
        this.checkDeliveryConfirmed();
      }
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.checkDeliveryConfirmed();
    });

    this.deliveryConfirmedChange.emit(this.formGroup.valid);

  }

  checkDeliveryConfirmed() {
    const deliveryDetails = this.formGroup.value as ShippingAddress;

    const deliveryConfirmed = deliveryDetails.firstName === this.deliveryDetails.firstName &&
                              deliveryDetails.lastName === this.deliveryDetails.lastName &&
                              deliveryDetails.phoneNumber === this.deliveryDetails.phoneNumber &&
                              deliveryDetails.email === this.deliveryDetails.email &&
                              deliveryDetails.streetNumber === this.deliveryDetails.streetNumber &&
                              deliveryDetails.street === this.deliveryDetails.street &&
                              deliveryDetails.city === this.deliveryDetails.city &&
                              deliveryDetails.region === this.deliveryDetails.region &&
                              deliveryDetails.postalCode === this.deliveryDetails.postalCode &&
                              deliveryDetails.country === this.deliveryDetails.country;

    this.deliveryConfirmedChange.emit(deliveryConfirmed);
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.formGroup.valid) {
      const delivery = this.formGroup.value;
      this.deliveryService.updateDeliveryDetails(delivery);
    }
  }
}
