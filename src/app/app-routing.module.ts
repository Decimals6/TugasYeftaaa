import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'detail/:index',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'mina',
    loadChildren: () => import('./mina/mina.module').then( m => m.MinaPageModule)
  },
  {
    path: 'minadetail/:index',
    loadChildren: () => import('./minadetail/minadetail.module').then( m => m.MinadetailPageModule)
  },
  {
    path: 'makkahakhir/:index',
    loadChildren: () => import('./makkahakhir/makkahakhir.module').then( m => m.MakkahakhirPageModule)
  },
  {
    path: 'makkahakhirdetail/:index1/:index2',
    loadChildren: () => import('./makkahakhirdetail/makkahakhirdetail.module').then( m => m.MakkahakhirdetailPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
