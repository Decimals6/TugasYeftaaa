import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DetailMinaPageRoutingModule } from './detail-mina-routing.module';
import { DetailMinaPage } from './detail-mina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailMinaPageRoutingModule,
    DetailMinaPage // ✅ Diimport karena standalone
  ]
})
export class DetailMinaPageModule {}
