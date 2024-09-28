import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list'
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-items',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatGridListModule, CommonModule, RouterLink],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent {

}
