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
  },  {
    path: 'detail-mina',
    loadChildren: () => import('./detail-mina/detail-mina.module').then( m => m.DetailMinaPageModule)
  },
  {
    path: 'detail-makkah-akhir',
    loadChildren: () => import('./detail-makkah-akhir/detail-makkah-akhir.module').then( m => m.DetailMakkahAkhirPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
