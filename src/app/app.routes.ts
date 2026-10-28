import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'loja', pathMatch: 'full' },
  { path: 'loja', loadComponent: () => import('./pages/loja/loja.component').then(m => m.LojaComponent) },
  { path: 'carrinho', loadComponent: () => import('./pages/carrinho/carrinho.component').then(m => m.CarrinhoComponent) },
  { path: 'admin/clientes', loadComponent: () => import('./pages/admin/clientes/clientes.component').then(m => m.ClientesComponent) },
  { path: 'admin/produtos', loadComponent: () => import('./pages/admin/produtos/produtos.component').then(m => m.ProdutosComponent) },
  { path: 'admin/categorias', loadComponent: () => import('./pages/admin/categorias/categorias.component').then(m => m.CategoriasComponent) },
  { path: 'admin/atendimentos', loadComponent: () => import('./pages/admin/atendimentos/atendimentos.component').then(m => m.AtendimentosComponent) },
  { path: '**', redirectTo: 'loja' }
];
