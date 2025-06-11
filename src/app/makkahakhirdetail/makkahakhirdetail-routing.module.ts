import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakkahakhirdetailPage } from './makkahakhirdetail.page';

const routes: Routes = [
  {
    path: '',
    component: MakkahakhirdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakkahakhirdetailPageRoutingModule {}
