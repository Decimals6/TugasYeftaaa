import { Component, OnInit } from '@angular/core';
import { TempatserviceService } from '../tempatservice.service';
import { Router } from '@angular/router';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tempats: any[] = [];
  tanggalList: number[] = [8, 9, 10, 11, 12, 13, 14];
  selectedTanggal: number | null = null;
  isLoading: boolean = false;
  currentUser: any = null;

  constructor(
    private tempatService: TempatserviceService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.loadUserData();
    this.isLoading = true;
    try {
      this.tempats = await this.tempatService.initData();
    } catch (error) {
      console.error('Error saat load data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  loadUserData() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      const raw = localStorage.getItem('user_session');
      if (raw) {
        this.currentUser = JSON.parse(raw);
      }
    }
  }

  tesrute() {
    this.router.navigate(['/tesrute']);
  }

  teskoor() {
    this.router.navigate(['/teskoor']);
  }

  goToDetail(id: any) {
    const target = this.tempats.find(t => t.id === id);
    if (!target) return;

    const nama = (target.name || target.nama || '').toLowerCase();

    if (nama.includes('mina')) {
      this.router.navigate(['/mina']);
    } else if (nama.includes('makkah')) {
      this.router.navigate(['/makkahakhir', id]);
    } else {
      this.router.navigate(['/detail', id]);
    }
  }

  onTanggalChange(event: any) {
    console.log('Tanggal dipilih:', this.selectedTanggal);
  }

  isOpenOnSelectedDate(openValue: number | number[]): boolean {
    if (!this.selectedTanggal || !openValue) return false;

    if (Array.isArray(openValue)) {
      return openValue.includes(this.selectedTanggal);
    }

    return openValue === this.selectedTanggal;
  }

  // --- RESET DENGAN COUNTDOWN 3 DETIK ---
  async reset() {
    let countdown = 3;

    const alert = await this.alertCtrl.create({
      header: 'PERINGATAN KERAS',
      subHeader: 'Reset Seluruh Riwayat Ibadah',
      message: `Tindakan ini akan menghapus semua progres manasik Anda dari server. Harap tunggu (${countdown} detik)...`,
      cssClass: 'custom-alert-danger',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: `Reset Sekarang (${countdown}s)`,
          cssClass: 'btn-confirm-danger is-disabled',
          handler: () => {
            if (countdown > 0) {
              return false; // Mencegah klik sebelum countdown 0
            }
            this.eksekusiResetServer();
            return true;
          }
        }
      ]
    });

    await alert.present();

    // Loop timer 1 detik untuk menghitung mundur
    const intervalTimer = setInterval(() => {
      countdown--;

      // Ambil elemen tombol konfirmasi dari DOM alert
      const confirmBtn = document.querySelector('.custom-alert-danger .btn-confirm-danger') as HTMLButtonElement;
      const alertMsg = document.querySelector('.custom-alert-danger .alert-message');

      if (confirmBtn) {
        if (countdown > 0) {
          confirmBtn.innerHTML = `<span class="alert-button-inner">Reset Sekarang (${countdown}s)</span>`;
          if (alertMsg) {
            alertMsg.textContent = `Tindakan ini akan menghapus semua progres manasik Anda dari server. Harap tunggu (${countdown} detik)...`;
          }
        } else {
          confirmBtn.innerHTML = `<span class="alert-button-inner">YA, SAYA YAKIN RESET</span>`;
          confirmBtn.classList.remove('is-disabled');
          if (alertMsg) {
            alertMsg.textContent = 'Tombol reset telah terbuka. Klik tombol merah di bawah untuk mengosongkan riwayat.';
          }
          clearInterval(intervalTimer);
        }
      } else {
        clearInterval(intervalTimer);
      }
    }, 1000);
  }

  async eksekusiResetServer() {
    const userId = this.currentUser?.id;
    if (!userId) {
      console.warn('ID User tidak ditemukan');
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Mereset data dari server...',
      spinner: 'crescent'
    });
    await loader.present();

    try {
      await firstValueFrom(this.tempatService.resetUserActivities(userId));

      // Bersihkan juga cache/storage lokal jika ada
      await this.tempatService.resetAllStatus();

      // Muat ulang data
      this.tempats = await this.tempatService.initData();

      const successAlert = await this.alertCtrl.create({
        header: 'Berhasil',
        message: 'Seluruh progres ibadah Anda telah dikosongkan.',
        buttons: ['OK']
      });
      await successAlert.present();
    } catch (err) {
      console.error('Gagal reset di database server:', err);
    } finally {
      await loader.dismiss();
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar dari akun?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Keluar',
          role: 'destructive',
          handler: () => {
            this.authService.logout();
            localStorage.removeItem('user_session');
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    await alert.present();
  }
}