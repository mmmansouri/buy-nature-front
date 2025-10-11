import { Component, OnInit, signal} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {take} from "rxjs";
import {OrderService} from "../../../services/order.service";

@Component({
    selector: 'app-order-creation',
    imports: [
        MatProgressSpinner
    ],
    templateUrl: './order-creation.component.html',
    styleUrl: './order-creation.component.scss'
})
export class OrderCreationComponent implements OnInit {

  orderStatus = signal<'loading' | 'success' | 'error'>('loading');

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.orderService.getCurrentOrder().pipe(
      take(1)
    ).subscribe(order => {
      if (order && order.paymentStatus === 'success') {
        this.orderStatus.set(order.paymentStatus);
        this.orderService.clearAllOrderData();
      } else {
        this.orderStatus.set('error');
      }
    });
  }

}
