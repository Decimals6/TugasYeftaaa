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
  tanggalList: number[] = [8, 9, 10, 11, 12, 13, 14];

  selectedTanggal: number | null = null;


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

  tesrute(){
    this.router.navigate(['/tesrute']);
  }

  teskoor(){
    this.router.navigate(['/teskoor']);
  }

  goToDetail(id: any) {
    const nama = this.tempats[id].nama.toLowerCase();

    if (nama.includes('mina')) {
      this.router.navigate(['/mina']);
    } else if (nama.includes('makkah')) {
      this.router.navigate(['/makkahakhir', id]);
    } else {
      this.router.navigate(['/detail', id]);
    }
  }
  async reset() {
    await this.tempatService.resetAllStatus();         // clear data dan storage
    await this.tempatService.loadStatusFromStorage();  // ambil ulang data dari storage
    this.tempats = this.tempatService.getTempat();     // refresh tampilan
  }

  onTanggalChange(event: any) {
    console.log('Tanggal dipilih:', this.selectedTanggal);
    // Lanjutkan aksi sesuai kebutuhanmu di sini
  }

  isOpenOnSelectedDate(openValue: number | number[]): boolean {
    if (!this.selectedTanggal) return false;

    // Kalau openValue adalah array
    if (Array.isArray(openValue)) {
      return openValue.includes(this.selectedTanggal);
    }

    // Kalau openValue hanya angka
    return openValue === this.selectedTanggal;
  }


}
