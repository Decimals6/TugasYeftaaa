import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TesrutePageRoutingModule } from './tesrute-routing.module';

import { TesrutePage } from './tesrute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TesrutePageRoutingModule
  ],
  declarations: [TesrutePage]
})
export class TesrutePageModule {}
