import { Routes } from '@angular/router';
import { ItemsComponent } from "./pages/items/items.component";
import { HomeComponent } from "./pages/home/home.component";
import {ItemDetailsComponent} from "./pages/item-details/item-details.component";
import {CheckoutComponent} from "./pages/checkout/checkout.component";
import {CustomerOrdersComponent} from "./pages/customer/customer-orders/customer-orders.component";
import {CustomerProfileComponent} from "./pages/customer/customer-profile/customer-profile.component";
import {CustomerCreationComponent} from "./pages/customer/customer-creation/customer-creation.component";
import {LoginComponent} from "./components/login/login.component";
import { userAuthGuard } from "./guards/user-auth.guard";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'item-details/:id', component: ItemDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'customer/create', component: CustomerCreationComponent },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'customer/profile',
    component: CustomerProfileComponent,
    canActivate: [userAuthGuard],
    data: { requiresCustomer: true }
  },
  {
    path: 'customer/orders',
    component: CustomerOrdersComponent,
    canActivate: [userAuthGuard],
    data: { requiresCustomer: true }
  },
  {
    path: '',
    redirectTo: 'customer/profile',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'customer/profile'
  }
];
