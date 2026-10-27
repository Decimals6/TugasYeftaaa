import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service'; // Sesuaikan path auth service kamu

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage {

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService,
  ) {}

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar dari akun admin?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Keluar',
          role: 'destructive',
          handler: () => {
            // 2. Hapus sesi via service
            this.authService.logout();

            // 3. Bersihkan juga sisa key lama kalau masih ada
            localStorage.removeItem('user_data');

            // 4. Arahkan balik ke login (atau welcome)
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    await alert.present();
  }
}