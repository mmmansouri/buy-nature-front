import { Routes } from '@angular/router';
import { ItemsComponent } from "./pages/items/items.component";
import { HomeComponent } from "./pages/home/home.component";
import {ItemDetailsComponent} from "./pages/item-details/item-details.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'item-details', component: ItemDetailsComponent }

];
