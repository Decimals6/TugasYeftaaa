import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  username_email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      if (user.role === 'admin') {
        this.navCtrl.navigateRoot('/admin');
      } else if (user.role === 'leader') {
        this.navCtrl.navigateRoot('/leader');
      } else {
        this.navCtrl.navigateRoot('/home');
      }
    }
  }

  async onSubmit() {
    if (!this.username_email || !this.password) {
      this.showToast('Username/Email dan Password harus diisi.', 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Sedang masuk...',
      spinner: 'crescent'
    });
    await loader.present();

    this.authService.login({
      username_email: this.username_email,
      password: this.password
    }).subscribe({
      next: async (res) => {
        await loader.dismiss();
        this.showToast(`Selamat datang, ${res.data.name}`, 'success');

        // Navigasi rute sesuai role
        if (res.data.role === 'admin') {
          this.navCtrl.navigateRoot('/admin');
        } else if (res.data.role === 'leader') {
          this.navCtrl.navigateRoot('/leader');
        } else {
          this.navCtrl.navigateRoot('/home');
        }
      },
      error: async (err) => {
        await loader.dismiss();
        const msg = err.error?.message || 'Gagal login. Periksa koneksi atau kredensial Anda.';
        this.showToast(msg, 'danger');
      }
    });
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}