import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

export interface CartSnackbarData {
  itemName: string;
  itemImage: string;
  itemPrice: number;
  quantity: number;
}

@Component({
  selector: 'app-cart-snackbar',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    CurrencyPipe
  ],
  templateUrl: './cart-snackbar.component.html',
  styleUrl: './cart-snackbar.component.scss'
})
export class CartSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: CartSnackbarData,
    public snackBarRef: MatSnackBarRef<CartSnackbarComponent>
  ) {}

  close(): void {
    this.snackBarRef.dismiss();
  }
}
