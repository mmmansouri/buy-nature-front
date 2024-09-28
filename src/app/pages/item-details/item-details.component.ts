import {
  Component,
  ComponentFactoryResolver,
  HostListener,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {ScreenService} from "../../services/screen.service";
import {CommonModule} from "@angular/common";
import {ItemPhotosCarrousselComponent} from "./item-photos-carroussel/item-photos-carroussel.component";
import {ItemDescriptionComponent} from "./item-description/item-description.component";
import {ItemDetailsBuyOptionsComponent} from "./item-details-buy-options/item-details-buy-options.component";

export interface Tile {
  position:string;
  cols: number;
  rows: number;
  color: string;
  component: Type<any>;
}

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [MatGridListModule, CommonModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent implements OnInit {
  @ViewChild('middleContainer', { read: ViewContainerRef }) middleContainer!: ViewContainerRef;
  @ViewChild('leftContainer', { read: ViewContainerRef }) leftContainer!: ViewContainerRef;
  @ViewChild('bottomContainer', { read: ViewContainerRef }) bottomContainer!: ViewContainerRef;

  gridCols: number = 4;
  gridRowHeight: string = '1:1';

  tiles: Tile[] = [
    {position:'middle', cols: 2,rows: 1, color: 'lightblue', component: ItemPhotosCarrousselComponent},
    {position:'left', cols: 1,rows: 2, color: 'lightgreen',component: ItemDetailsBuyOptionsComponent},
    {position:'bottom', cols: 2,rows: 1, color: '#DDBDF1',component:ItemDescriptionComponent},
  ];

  constructor( protected screenService: ScreenService) {}

  ngOnInit() {
    this.resizeGrid();
  }

  ngAfterViewInit() {
    this.loadComponents();
  }

  // Listen to window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeGrid();
  }

  private resizeGrid() {
    if (this.screenService.isMobile()) {
      this.tiles[0].cols =1;
      this.tiles[1].cols =1;
      this.tiles[2].cols =1;
      this.gridCols = 1;  // Mobile screen, one column
      this.gridRowHeight = '2:1'; // Adjust the tile height for mobile
    } else {
      this.tiles[0].cols =3;
      this.tiles[1].cols =1;
      this.tiles[2].cols =3;
      this.gridCols = 4;  // Larger screens, four columns
      this.gridRowHeight = '1:1';
    }
  }

  // Method to dynamically load components into the grid
  loadComponents() {
    this.middleContainer.clear();
    this.leftContainer.clear();
    this.bottomContainer.clear();

    this.middleContainer.createComponent(this.tiles[0].component);
    this.leftContainer.createComponent(this.tiles[1].component);
    this.bottomContainer.createComponent(this.tiles[2].component);

  }
}
