import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { Observable } from 'rxjs';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import { MatCardModule } from '@angular/material/card';
import {DeliveryService} from "../../../services/delivery.service";
import {ShippingAddress} from "../../../models/shipping-address.model";
import {OrderItem} from "../../../models/order.item.model";

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss'],
  standalone: true,
  imports: [NgForOf,
    NgIf,
    AsyncPipe,
    CurrencyPipe, MatTable, MatHeaderCell, MatCell, MatFooterCell, MatColumnDef, MatHeaderRow, MatRow, MatFooterRow, MatHeaderCellDef, MatCellDef, MatFooterCellDef, MatHeaderRowDef, MatRowDef, MatFooterRowDef, MatCardModule]
})
export class OrderReviewComponent implements OnInit {
  order$: Observable<Order>;
  delivery$: Observable<ShippingAddress>;
  totalPrice$: Observable<number>;
  cartItems$: Observable<OrderItem[]>;

  displayedColumns: string[] = ['name', 'quantity', 'unitPrice', 'totalPrice'];

  constructor(private orderService: OrderService,
              private cartService: CartService,
              private deliveryService: DeliveryService) {
    this.order$ = this.orderService.getOrder();
    this.delivery$ = this.deliveryService.getDeliveryDetails();
    this.totalPrice$ = this.cartService.getTotalPrice();
    this.cartItems$ = this.cartService.getCartItems();
  }
  ngOnInit(): void {
  }
}
