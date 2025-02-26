import {AfterViewInit, ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatStepperPrevious} from "@angular/material/stepper";
import {OrderService} from "../../../services/order.service";

@Component({
  selector: 'app-order-creation',
  standalone: true,
    imports: [
        MatButton,
        MatProgressSpinner,
        MatStepperPrevious
    ],
  templateUrl: './order-creation.component.html',
  styleUrl: './order-creation.component.scss'
})
export class OrderCreationComponent implements OnInit {

  orderStatus = signal<'loading' | 'success' | 'error'>('loading');

  constructor(private orderService: OrderService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.orderService.createOrder().subscribe(status => {
      this.orderStatus.set(status);
      this.orderService.clearOrder();
    });
  }

}
