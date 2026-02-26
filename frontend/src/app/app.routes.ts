import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },

  {
    path: 'productos',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'agregar',
    loadComponent: () =>
      import('./components/add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./components/edit-product/edit-product.component').then(
        (m) => m.EditProductComponent
      ),
  },
];
