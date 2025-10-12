import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Item } from '../../models/item.model';
import { ItemsService } from '../../services/items.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

/**
 * Item Details Component - Modern Angular 19+ Implementation
 *
 * Features:
 * - Signal-based state management
 * - Modern product detail layout
 * - Quantity selector and cart integration
 * - Responsive image gallery
 */
@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent implements OnInit {
  // Signals for reactive state
  item = signal<Item | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Quantity selector
  quantity: number = 1;
  quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private itemService: ItemsService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (!itemId) {
      this.error.set('No item ID provided');
      this.loading.set(false);
      return;
    }

    this.loadItem(itemId);
  }

  loadItem(itemId: string) {
    this.loading.set(true);
    this.error.set(null);

    this.itemService.getItemById(itemId).subscribe({
      next: (item) => {
        if (item) {
          this.item.set(item);
        } else {
          this.error.set('Item not found');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching item:', err);
        this.error.set('Failed to load item details. Please try again.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Add item to cart with selected quantity
   */
  addToCart() {
    const currentItem = this.item();
    if (!currentItem) return;

    this.cartService.addToCart({
      item: currentItem,
      quantity: this.quantity
    });

    // Show notification via NotificationService
    this.notificationService.showCartNotification({
      itemName: currentItem.name,
      itemImage: currentItem.imageUrl,
      itemPrice: currentItem.price,
      quantity: this.quantity
    });

    // Reset quantity after adding
    this.quantity = 1;
  }

  /**
   * Navigate back to items list
   */
  goBack() {
    this.router.navigate(['/items']);
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

  /**
   * Check if item is in stock (placeholder logic)
   */
  isInStock(): boolean {
    return true; // Add real stock logic when available
  }
}
