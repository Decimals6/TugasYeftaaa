import { Component, OnInit } from '@angular/core';
import { TempatserviceService } from '../tempatservice.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-makkahakhir',
  templateUrl: './makkahakhir.page.html',
  styleUrls: ['./makkahakhir.page.scss'],
  standalone: false,
})
export class MakkahakhirPage {
  tempats: any[] = [];
  id1: number = 0;
  constructor(
    private tempatService: TempatserviceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ionViewWillEnter() {
    this.route.params.subscribe(async params => {
      this.id1 = +params['index'];
      await this.tempatService.loadTempatStatusFromStorage(this.tempatService.tempatList);
      this.tempats = this.tempatService.tempatList[this.id1]?.list ?? [];
      console.log('Refreshed tempats:', this.tempats);
    });
  }

  goToDetail(id2: any) {
    const nama = this.tempats[id2].nama.toLowerCase();
    this.router.navigate(['/makkahakhirdetail', this.id1, id2]);

  }
  async reset() {
    await this.tempatService.resetAllTempatStatus(this.tempatService.tempatList);         // clear data dan storage
    await this.tempatService.loadTempatStatusFromStorage(this.tempatService.tempatList);  // ambil ulang data dari storage
    this.tempats = this.tempatService.tempatList[this.id1]?.list ?? [];     // refresh tampilan
  }

}
