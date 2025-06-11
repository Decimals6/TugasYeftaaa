import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MakkahakhirPageRoutingModule } from './makkahakhir-routing.module';

import { MakkahakhirPage } from './makkahakhir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MakkahakhirPageRoutingModule
  ],
  declarations: [MakkahakhirPage]
})
export class MakkahakhirPageModule {}
