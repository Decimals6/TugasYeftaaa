import { Component, OnInit } from '@angular/core';
import { TempatserviceService } from '../tempatservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  tempats: any[] = [];

  constructor(
    private tempatService: TempatserviceService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.tempatService.loadStatusFromStorage().then(() => {
      this.tempats = this.tempatService.getTempat();
      console.log('Refreshed tempats:', this.tempats);
    });
  }

  goToDetail(id: any) {
    const nama = this.tempats[id].nama.toLowerCase();

    if (nama.includes('mina')) {
      this.router.navigate(['/mina']);
    } else if (nama.includes('akhir')) {
      this.router.navigate(['/makkahakhir']);
    } else {
      this.router.navigate(['/detail', id]);
    }
  }
  async reset() {
    await this.tempatService.resetAllStatus();         // clear data dan storage
    await this.tempatService.loadStatusFromStorage();  // ambil ulang data dari storage
    this.tempats = this.tempatService.getTempat();     // refresh tampilan
  }


}
