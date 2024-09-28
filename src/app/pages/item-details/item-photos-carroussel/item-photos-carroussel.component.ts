import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-item-photos-carroussel',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatGridListModule, CommonModule, RouterLink],
  templateUrl: './item-photos-carroussel.component.html',
  styleUrl: './item-photos-carroussel.component.scss'
})
export class ItemPhotosCarrousselComponent {

}
