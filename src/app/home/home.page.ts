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
  isLoading: boolean = false; // Tambahan buat penanda loading jika perlu

  constructor(
    private tempatService: TempatserviceService,
    private router: Router
  ) { }

  // 1. CARA PANGGIL INIT DATA
  async ionViewWillEnter() {
    this.isLoading = true;
    try {
      // initData() akan fetch API -> sync ke Storage -> balikin array data
      this.tempats = await this.tempatService.initData();
      console.log('Data tempats berhasil dimuat:', this.tempats);
    } catch (error) {
      console.error('Error saat load data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  tesrute() {
    this.router.navigate(['/tesrute']);
  }

  teskoor() {
    this.router.navigate(['/teskoor']);
  }

  // 2. PERBAIKAN goToDetail
  // Jangan pakai this.tempats[id] karena id database belum tentu sama dengan index array
  goToDetail(id: any) {
    const target = this.tempats.find(t => t.id === id);
    if (!target) return;

    const nama = target.name.toLowerCase();

    if (nama.includes('mina')) {
      this.router.navigate(['/mina']);
    } else if (nama.includes('makkah')) {
      this.router.navigate(['/makkahakhir', id]);
    } else {
      this.router.navigate(['/detail', id]);
    }
  }

  // 3. RESET
  async reset() {
    await this.tempatService.resetAllStatus();
    this.tempats = this.tempatService.getTempat(); // ambil data yang sudah ter-reset
  }

  onTanggalChange(event: any) {
    console.log('Tanggal dipilih:', this.selectedTanggal);
  }

  isOpenOnSelectedDate(openValue: number | number[]): boolean {
    if (!this.selectedTanggal || !openValue) return false;

    // Kalau di API JSON openValue tipenya string misal "8" atau "[11,12]", 
    // pastikan nilainya array / number
    if (Array.isArray(openValue)) {
      return openValue.includes(this.selectedTanggal);
    }

    return openValue === this.selectedTanggal;
  }
}