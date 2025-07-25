import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },

  {
    path: 'productos',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        (m) => m.ProductListComponent
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
