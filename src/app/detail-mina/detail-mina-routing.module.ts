import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailMinaPage } from './detail-mina.page';

const routes: Routes = [
  {
    path: '',
    component: DetailMinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailMinaPageRoutingModule {}
