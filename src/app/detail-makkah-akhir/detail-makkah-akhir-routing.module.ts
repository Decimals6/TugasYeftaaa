import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailMakkahAkhirPage } from './detail-makkah-akhir.page';

const routes: Routes = [
  {
    path: '',
    component: DetailMakkahAkhirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailMakkahAkhirPageRoutingModule {}
