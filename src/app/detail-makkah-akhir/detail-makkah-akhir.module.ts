import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DetailMakkahAkhirPageRoutingModule } from './detail-makkah-akhir-routing.module';
import { DetailMakkahAkhirPage } from './detail-makkah-akhir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailMakkahAkhirPageRoutingModule,
    DetailMakkahAkhirPage  // ✅ di-import karena standalone
  ]
})

export class DetailMakkahAkhirPageModule {}
