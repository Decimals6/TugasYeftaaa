import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaderPage } from './leader.page';

const routes: Routes = [
  {
    path: '',
    component: LeaderPage
  },  {
    path: 'maps',
    loadChildren: () => import('./maps/maps.module').then( m => m.MapsPageModule)
  },
  {
    path: 'jamaah',
    loadChildren: () => import('./jamaah/jamaah.module').then( m => m.JamaahPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaderPageRoutingModule {}
