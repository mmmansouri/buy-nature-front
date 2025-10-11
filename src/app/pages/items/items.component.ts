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




@Component({
    selector: 'app-items',
    imports: [MatCardModule, MatButtonModule, MatGridListModule, CommonModule, RouterLink, MatProgressSpinner],
    templateUrl: './items.component.html',
    styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];
  isLoading: boolean = true;

  constructor(private itemsService: ItemsService, private cartService: CartService) {}

  ngOnInit() {
    // Dispatch action to load items
    this.itemsService.loadItems();

    // Subscribe to items from store
    this.loadItems();
  }

  loadItems() {
    this.isLoading = true; // Start loading
    this.itemsService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false; // Stop loading after data is fetched
      },
      error: () => {
        this.isLoading = false; // Stop loading on error
        // Optionally handle the error, like showing a message
      }
    });
  }

  addItem(item: Item): void {
    this.itemsService.getItemById(item.id).subscribe({
      next: (item) => {
        if (item) {
          this.cartService.addToCart({item, quantity: 1})
        }
      },
      error: (err) => console.error('Error fetching item:', err)
    });
  }

}
