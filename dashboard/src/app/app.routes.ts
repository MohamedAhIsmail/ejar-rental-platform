import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { MainLayoutComponentComponent } from './main-layout-component/main-layout-component.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NewUsersComponent } from './new-users/new-users.component';
import { NewProductsComponent } from './new-products/new-products.component';
import { AllProductsComponent } from './products/products.component';
import { AllProcessComponent } from './process/process.component';
import { AllCategoriesComponent } from './categories/categories.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './Login/login.component';
import { authGuard } from './auth.guard';

import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/statistics', pathMatch: 'full' },
  {
    path: '',
    component: AuthComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },
  {
    path: '',
    component: MainLayoutComponentComponent,
    canActivate: [authGuard],

    children: [
      { path: 'statistics', component: StatisticsComponent, title: "Statistics" },
      { path: 'new-users', component: NewUsersComponent, title: "New Users" },
      { path: 'new-products', component: NewProductsComponent, title: "New Products" },
      { path: 'products', component: AllProductsComponent, title: "Products" },
      { path: 'processes', component: AllProcessComponent, title: "Processes" },
      { path: 'categories', component: AllCategoriesComponent, title: "Categories" },
      { path: 'users', component: UserListComponent, title: "Users" },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
