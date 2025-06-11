import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TempatserviceService } from '../tempatservice.service';

@Component({
  selector: 'app-mina',
  templateUrl: './mina.page.html',
  styleUrls: ['./mina.page.scss'],
  standalone: false,
})
export class MinaPage {
  tempats: any[] = [];
  
  constructor(
    private tempatService: TempatserviceService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.tempatService.loadStatusFromStorage().then(() => {
      this.tempats = this.tempatService.getMina();
      console.log('Refreshed tempats:', this.tempats);
    });
  }

  goToDetail(id: any) {
    const nama = this.tempats[id].nama.toLowerCase();
    this.router.navigate(['/minadetail', id]);  
  }
  async reset() {
    await this.tempatService.resetAllMinaStatus();         // clear data dan storage
    await this.tempatService.loadStatusFromStorage();  // ambil ulang data dari storage
    this.tempats = this.tempatService.getMina();     // refresh tampilan
  }

}
