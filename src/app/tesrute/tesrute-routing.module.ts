import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TesrutePage } from './tesrute.page';

const routes: Routes = [
  {
    path: '',
    component: TesrutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TesrutePageRoutingModule {}
