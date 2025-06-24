import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeskoorPageRoutingModule } from './teskoor-routing.module';

import { TeskoorPage } from './teskoor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeskoorPageRoutingModule
  ],
  declarations: [TeskoorPage]
})
export class TeskoorPageModule {}
