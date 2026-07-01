import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupHajiPageRoutingModule } from './group-haji-routing.module';

import { GroupHajiPage } from './group-haji.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupHajiPageRoutingModule
  ],
  declarations: [GroupHajiPage]
})
export class GroupHajiPageModule {}
