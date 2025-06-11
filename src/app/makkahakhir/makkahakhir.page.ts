import { Component, OnInit } from '@angular/core';
import { TempatserviceService } from '../tempatservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-makkahakhir',
  templateUrl: './makkahakhir.page.html',
  styleUrls: ['./makkahakhir.page.scss'],
  standalone: false,
})
export class MakkahakhirPage {
  tempats: any[] = [];
  constructor(
    private tempatService: TempatserviceService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.tempatService.loadStatusFromStorage().then(() => {
      this.tempats = this.tempatService.getMakkah();
      console.log('Refreshed tempats:', this.tempats);
    });
  }

  goToDetail(id: any) {
    const nama = this.tempats[id].nama.toLowerCase();
    this.router.navigate(['/makkahakhirdetail', id]);
    
  }
  async reset() {
    await this.tempatService.resetAllMakkahStatus();         // clear data dan storage
    await this.tempatService.loadMakkahStatusFromStorage();  // ambil ulang data dari storage
    this.tempats = this.tempatService.getMakkah();     // refresh tampilan
  }

}
