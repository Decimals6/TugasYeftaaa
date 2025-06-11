import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MakkahakhirdetailPageRoutingModule } from './makkahakhirdetail-routing.module';

import { MakkahakhirdetailPage } from './makkahakhirdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MakkahakhirdetailPageRoutingModule
  ],
  declarations: [MakkahakhirdetailPage]
})
export class MakkahakhirdetailPageModule {}
