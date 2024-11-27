import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Observable} from "rxjs";
import {Delivery} from "../../models/delivery.model";
import {DeliveryService} from "./delivery.service";

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

  delivery$: Observable<Delivery>;

  @Input() formGroup!: FormGroup;

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
    this.formGroup.addControl('phone', this.fb.control('', [Validators.required, Validators.minLength(2)]));
    this.formGroup.addControl('email', this.fb.control('', [Validators.required, Validators.email]));
    this.formGroup.addControl('address', this.fb.group({
      street: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      region: ['', Validators.required],
      country: ['', Validators.required],
    }));

    // Subscribe to delivery$ to prefill form values
    this.delivery$.subscribe(delivery => {
      if (delivery) {
        this.formGroup.patchValue(delivery);
      }
    });

  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.formGroup.valid) {
      const delivery = this.formGroup.value;
      this.deliveryService.updateDeliveryDetails(delivery);
    }
  }
}
