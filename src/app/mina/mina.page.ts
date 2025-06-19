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
  tanggalList: number[] = [8, 9, 10, 11, 12, 13, 14];

  selectedTanggal: number | null = null;
  
  constructor(
    private tempatService: TempatserviceService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.tempatService.loadStatusFromStorage().then(() => {
      this.tempats = this.tempatService.tempatList[3]?.list ?? [];
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
