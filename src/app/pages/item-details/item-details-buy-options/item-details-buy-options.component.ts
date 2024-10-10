import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CartService} from "../../cart/cart.service";

@Component({
  selector: 'app-item-details-buy-options',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, MatDividerModule, MatCardModule, MatButtonModule, MatGridListModule, CommonModule, RouterLink],
  templateUrl: './item-details-buy-options.component.html',
  styleUrl: './item-details-buy-options.component.scss'
})
export class ItemDetailsBuyOptionsComponent   {
  size = 'N';
  quantity = "0";

  constructor(private cartService: CartService) {
  }

  addToCart() {
      this.cartService.addToCart(parseInt(this.quantity));
      this.resetSelection();
  }

  resetSelection(): void {
    this.quantity = "0";
    this.size ="N";
  }
}
