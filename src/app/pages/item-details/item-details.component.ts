import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Item } from '../../models/item.model';
import { ItemsService } from '../../services/items.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

/**
 * Item Details Component - Responsive Layout Implementation
 *
 * Features:
 * - Signal-based state management
 * - Responsive grid layout (desktop/tablet vs mobile)
 * - Image gallery with navigation
 * - Quantity selector and cart integration
 * - Bio-themed design
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

  // Responsive breakpoint detection
  isMobile = signal<boolean>(false);

  // Image gallery state
  images = signal<string[]>([]);
  selectedImageIndex = signal<number>(0);

  // Quantity selector
  quantity: number = 1;
  quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private itemService: ItemsService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private breakpointObserver: BreakpointObserver
  ) {
    // Observe breakpoint changes for responsive layout
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ]).subscribe(result => {
      this.isMobile.set(result.matches);
    });
  }

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
          // Initialize image gallery (for now using single image, expandable for multiple)
          this.images.set(item.imageUrl ? [item.imageUrl] : []);
          this.selectedImageIndex.set(0);
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

  /**
   * Get currently selected image URL
   */
  getSelectedImage(): string {
    const imgs = this.images();
    const index = this.selectedImageIndex();
    return imgs.length > 0 ? imgs[index] : '';
  }

  /**
   * Navigate to previous image
   */
  previousImage(): void {
    const imgs = this.images();
    if (imgs.length === 0) return;

    const currentIndex = this.selectedImageIndex();
    const newIndex = currentIndex === 0 ? imgs.length - 1 : currentIndex - 1;
    this.selectedImageIndex.set(newIndex);
  }

  /**
   * Navigate to next image
   */
  nextImage(): void {
    const imgs = this.images();
    if (imgs.length === 0) return;

    const currentIndex = this.selectedImageIndex();
    const newIndex = currentIndex === imgs.length - 1 ? 0 : currentIndex + 1;
    this.selectedImageIndex.set(newIndex);
  }

  /**
   * Select image by index
   */
  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  /**
   * Add to cart and navigate to checkout
   */
  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }
}
