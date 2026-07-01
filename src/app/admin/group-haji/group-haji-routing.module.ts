import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupHajiPage } from './group-haji.page';

const routes: Routes = [
  {
    path: '',
    component: GroupHajiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupHajiPageRoutingModule {}
