import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JamaahPageRoutingModule } from './jamaah-routing.module';

import { JamaahPage } from './jamaah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JamaahPageRoutingModule
  ],
  declarations: [JamaahPage]
})
export class JamaahPageModule {}
