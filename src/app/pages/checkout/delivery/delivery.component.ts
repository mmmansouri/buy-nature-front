import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Observable} from "rxjs";
import {ShippingAddress} from "../../../models/delivery.model";
import { DeliveryService } from '../../../services/delivery.service';


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
    this.formGroup.addControl('firstname', this.fb.control('', [Validators.required, Validators.minLength(2)]));
    this.formGroup.addControl('lastname', this.fb.control('', [Validators.required, Validators.minLength(2)]));
    this.formGroup.addControl('phone', this.fb.control('', [
      Validators.required,
      Validators.pattern('^(\\+33|0)[1-9](\\d{2}){4}$') // French phone number format
    ]));
    this.formGroup.addControl('email', this.fb.control('', [Validators.required, Validators.email]));
    this.formGroup.addControl('address', this.fb.group({
      number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      country: ['', Validators.required]
    }));

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

    const deliveryConfirmed = deliveryDetails.firstname === this.deliveryDetails.firstname &&
                              deliveryDetails.lastname === this.deliveryDetails.lastname &&
                              deliveryDetails.phone === this.deliveryDetails.phone &&
                              deliveryDetails.email === this.deliveryDetails.email &&
                              deliveryDetails.address.streetNumber === this.deliveryDetails.address.streetNumber &&
                              deliveryDetails.address.street === this.deliveryDetails.address.street &&
                              deliveryDetails.address.city === this.deliveryDetails.address.city &&
                              deliveryDetails.address.region === this.deliveryDetails.address.region &&
                              deliveryDetails.address.postalCode === this.deliveryDetails.address.postalCode &&
                              deliveryDetails.address.country === this.deliveryDetails.address.country;

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
