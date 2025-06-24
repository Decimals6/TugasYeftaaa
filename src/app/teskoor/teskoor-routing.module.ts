import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeskoorPage } from './teskoor.page';

const routes: Routes = [
  {
    path: '',
    component: TeskoorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeskoorPageRoutingModule {}
