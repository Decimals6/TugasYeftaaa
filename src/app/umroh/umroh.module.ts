import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UmrohPageRoutingModule } from './umroh-routing.module';

import { UmrohPage } from './umroh.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UmrohPageRoutingModule
  ],
  declarations: [UmrohPage]
})
export class UmrohPageModule {}
