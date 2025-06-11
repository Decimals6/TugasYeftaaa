import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinadetailPageRoutingModule } from './minadetail-routing.module';

import { MinadetailPage } from './minadetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinadetailPageRoutingModule
  ],
  declarations: [MinadetailPage]
})
export class MinadetailPageModule {}
