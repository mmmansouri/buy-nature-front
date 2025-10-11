import {Component, Input, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Item} from "../../../models/item.model";
import { CartService } from '../../../services/cart.service';

@Component({
    selector: 'app-item-details-buy-options',
    imports: [MatSelectModule, MatFormFieldModule, MatDividerModule, MatCardModule, MatButtonModule, MatGridListModule, CommonModule],
    templateUrl: './item-details-buy-options.component.html',
    styleUrl: './item-details-buy-options.component.scss'
})
export class ItemDetailsBuyOptionsComponent  {
  @Input() item!: Item | undefined;

  size = 'N';
  quantity = "0";

  constructor(private cartService: CartService) {
  }

  addToCart() {
    if (this.item) {
      this.cartService.addToCart(
        {item: this.item, quantity: parseInt(this.quantity)}
      );
    }

    this.resetSelection();
  }

  resetSelection(): void {
    this.quantity = "0";
    this.size ="N";
  }
}
