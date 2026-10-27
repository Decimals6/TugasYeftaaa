import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JamaahPage } from './jamaah.page';

const routes: Routes = [
  {
    path: '',
    component: JamaahPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JamaahPageRoutingModule {}
