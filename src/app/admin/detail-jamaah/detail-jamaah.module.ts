import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailJamaahPageRoutingModule } from './detail-jamaah-routing.module';

import { DetailJamaahPage } from './detail-jamaah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailJamaahPageRoutingModule
  ],
  declarations: [DetailJamaahPage]
})
export class DetailJamaahPageModule {}
