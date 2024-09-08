import { Routes } from '@angular/router';
import { ItemsComponent } from "./pages/items/items.component";
import { HomeComponent } from "./pages/home/home.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'items', component: ItemsComponent }

];
