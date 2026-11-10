import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UmrohPage } from './umroh.page';

const routes: Routes = [
  {
    path: '',
    component: UmrohPage
  },  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'activity',
    loadChildren: () => import('./activity/activity.module').then( m => m.ActivityPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UmrohPageRoutingModule {}
