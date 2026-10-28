import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'loja', pathMatch: 'full' },
  { 
    path: 'loja', 
    loadComponent: () => import('./pages/loja/loja.component').then(m => m.LojaComponent) 
  },
  { 
    path: 'carrinho', 
    loadComponent: () => import('./pages/carrinho/carrinho.component').then(m => m.CarrinhoComponent) 
  },
  { 
    path: 'admin/clientes', 
    loadComponent: () => import('./pages/admin/clientes/clientes.component').then(m => m.ClientesComponent) 
  },
  { path: '**', redirectTo: 'loja' }
];
