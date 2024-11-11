import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list'
import {RouterLink} from "@angular/router";
import {Item} from "../../models/item.model";
import { HttpClient } from "@angular/common/http";
import {MatProgressSpinner} from "@angular/material/progress-spinner";


@Component({
  selector: 'app-items',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatGridListModule, CommonModule, RouterLink, MatProgressSpinner],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.http.get<Item[]>('assets/mock-data/items.json').subscribe((data) => {
      this.items = data;
      this.isLoading = false;
    });
  }

}
