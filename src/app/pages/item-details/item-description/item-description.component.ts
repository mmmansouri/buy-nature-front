import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {Item} from "../../../models/item.model";

@Component({
  selector: 'app-item-description',
  standalone: true,
  imports: [MatTabsModule, MatCardModule, MatButtonModule, MatGridListModule, CommonModule, RouterLink],
  templateUrl: './item-description.component.html',
  styleUrl: './item-description.component.scss'
})
export class ItemDescriptionComponent {
  @Input() item!: Item | undefined;

}
