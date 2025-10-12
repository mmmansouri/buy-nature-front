import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list'
import {RouterLink} from "@angular/router";
import {Item} from "../../models/item.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { ItemsService } from '../../services/items.service';
import { CartService } from '../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';




@Component({
    selector: 'app-items',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatGridListModule,
        CommonModule,
        RouterLink,
        MatProgressSpinner,
        MatIconModule,
        MatChipsModule,
        MatSnackBarModule
    ],
    templateUrl: './items.component.html',
    styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private itemsService: ItemsService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Dispatch action to load items
    this.itemsService.loadItems();

    // Subscribe to items from store
    this.loadItems();
  }

  loadItems() {
    this.isLoading = true;
    this.error = null;
    this.itemsService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load items. Please try again.';
        console.error('Error loading items:', err);
      }
    });
  }

  addItem(item: Item, event: Event): void {
    event.stopPropagation(); // Prevent navigation to details
    this.itemsService.getItemById(item.id).subscribe({
      next: (item) => {
        if (item) {
          this.cartService.addToCart({item, quantity: 1});
          this.snackBar.open(`${item.name} added to cart!`, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      },
      error: (err) => {
        console.error('Error fetching item:', err);
        this.snackBar.open('Failed to add item to cart', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  /**
   * Format price for display
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

}
