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
  ) { }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar dari akun admin?',
      cssClass: 'custom-alert-danger',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'alert-btn-cancel'
        },
        {
          text: 'Keluar',
          role: 'destructive',
          cssClass: 'btn-confirm-danger',
          handler: () => {
            this.authService.logout();
            localStorage.removeItem('user_data');
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    await alert.present();
  }
}