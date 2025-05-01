import { Routes } from '@angular/router';
import { ItemsComponent } from "./pages/items/items.component";
import { HomeComponent } from "./pages/home/home.component";
import {ItemDetailsComponent} from "./pages/item-details/item-details.component";
import {CheckoutComponent} from "./pages/checkout/checkout.component";
import {CustomerOrdersComponent} from "./pages/customer-orders/customer-orders.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'item-details/:id', component: ItemDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'customer/orders', component: CustomerOrdersComponent }
];
