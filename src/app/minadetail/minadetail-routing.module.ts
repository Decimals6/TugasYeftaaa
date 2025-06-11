import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinadetailPage } from './minadetail.page';

const routes: Routes = [
  {
    path: '',
    component: MinadetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinadetailPageRoutingModule {}
