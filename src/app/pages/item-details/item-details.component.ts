import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {ItemPhotosCarrousselComponent} from "./item-photos-carroussel/item-photos-carroussel.component";
import {ItemDescriptionComponent} from "./item-description/item-description.component";
import {ItemDetailsBuyOptionsComponent} from "./item-details-buy-options/item-details-buy-options.component";
import {MatCard, MatCardContent} from "@angular/material/card";
import {ActivatedRoute} from "@angular/router";
import {Item} from "../../models/item.model";
import { ItemsService } from '../../services/items.service';



@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [MatGridListModule, CommonModule, ItemDetailsBuyOptionsComponent, ItemPhotosCarrousselComponent, ItemDescriptionComponent, MatCard, MatCardContent],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('middleContainer', { read: ViewContainerRef }) middleContainer!: ViewContainerRef;
  @ViewChild('leftContainer', { read: ViewContainerRef }) leftContainer!: ViewContainerRef;
  @ViewChild('bottomContainer', { read: ViewContainerRef }) bottomContainer!: ViewContainerRef;

  item!: Item | undefined;
  isItemLoaded = false; // Tracks when the item data is loaded
  isViewInitialized = false; // Tracks when the ViewChild references are initialized

  constructor(private route: ActivatedRoute, private itemService: ItemsService) {}

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id')!;
    this.itemService.getItemById(itemId).subscribe({
      next: (item) => {
        this.item = item;
        this.isItemLoaded = true; // Mark item as loaded
        this.tryLoadComponents(); // Attempt to load components
      },
      error: (err) => console.error('Error fetching item:', err)
    });
  }

  ngAfterViewInit() {
    this.isViewInitialized = true; // Mark view as initialized
    this.tryLoadComponents(); // Attempt to load components
  }

  // Method to dynamically load components into the grid
  private tryLoadComponents() {
    if (this.isItemLoaded && this.isViewInitialized) {
      // Only proceed if both the item and view references are ready
      this.loadComponents();
    }
  }

  private loadComponents() {
    this.middleContainer.clear();
    this.leftContainer.clear();
    this.bottomContainer.clear();

    this.middleContainer.createComponent(ItemPhotosCarrousselComponent);

    const itemBuyOptionsComponentRef = this.leftContainer.createComponent(ItemDetailsBuyOptionsComponent);
    itemBuyOptionsComponentRef.instance.item = this.item;

    const descriptionComponentRef = this.bottomContainer.createComponent(ItemDescriptionComponent);
    descriptionComponentRef.instance.item = this.item;
  }
}
