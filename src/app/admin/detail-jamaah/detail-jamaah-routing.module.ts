import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailJamaahPage } from './detail-jamaah.page';

const routes: Routes = [
  {
    path: '',
    component: DetailJamaahPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailJamaahPageRoutingModule {}
