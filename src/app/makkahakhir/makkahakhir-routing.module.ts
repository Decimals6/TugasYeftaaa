import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakkahakhirPage } from './makkahakhir.page';

const routes: Routes = [
  {
    path: '',
    component: MakkahakhirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakkahakhirPageRoutingModule {}
