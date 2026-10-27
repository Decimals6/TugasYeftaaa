import { Component } from '@angular/core';
import { TempatserviceService } from '../tempatservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-makkahakhir',
  templateUrl: './makkahakhir.page.html',
  styleUrls: ['./makkahakhir.page.scss'],
  standalone: false,
})
export class MakkahakhirPage {
  tempats: any[] = [];
  id1: number = 0;
  locationTitle: string = 'Makkah';
  locationDesc: string = 'Rangkaian Tawaf dan Sa\'i di Masjidil Haram.';

  constructor(
    private tempatService: TempatserviceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ionViewWillEnter() {
    this.route.params.subscribe(async params => {
      // Menangkap parameter index atau id yang dilempar dari routing
      this.id1 = +(params['index'] || params['id'] || 0);

      try {
        const data = await this.tempatService.initData();
        const target = data.find((tempat: any) => tempat.id === this.id1);

        if (target) {
          this.locationTitle = target.name || target.nama || 'Makkah';
          this.locationDesc = target.description || target.keterangan || 'Rangkaian Tawaf dan Sa\'i di Masjidil Haram.';
          this.tempats = target.list ?? [];
        } else {
          this.tempats = [];
        }

        console.log('ID location terpilih:', this.id1);
        console.log('Target location:', target);
        console.log('Activities:', this.tempats);

      } catch (error) {
        console.error('Gagal load data Makkah:', error);
        this.tempats = [];
      }
    });
  }

  goToDetail(id2: any) {
    this.router.navigate(['/makkahakhirdetail', this.id1, id2]);
  }

  async reset() {
    await this.tempatService.resetAllTempatStatus(this.tempatService.tempatList);
    await this.tempatService.loadTempatStatusFromStorage(this.tempatService.tempatList);
    
    const target = this.tempatService.tempatList.find((t: any) => t.id === this.id1);
    this.tempats = target?.list ?? [];
  }
}