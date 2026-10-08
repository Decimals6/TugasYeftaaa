import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TempatserviceService } from '../tempatservice.service'; // <-- Sesuaikan path service-mu
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  usernameEmail: string = '';
  password: string = '';
  showPassword: boolean = false;

  // Inject TempatService dan AlertController
  constructor(
    private router: Router,
    private tempatService: TempatserviceService,
    private alertCtrl: AlertController
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  prosesLogin() {
    // Validasi dasar biar gak kosongan pas di-klik
    if (!this.usernameEmail || !this.password) {
      this.tampilAlert('Peringatan', 'Username/Email dan Password wajib diisi!');
      return;
    }

    console.log('Mencoba login ke server...');

    // Panggil service API cPanel
    this.tempatService.loginAPI(this.usernameEmail, this.password).subscribe({
      next: (response: any) => {
        console.log('Respon dari server:', response);

        if (response.status === 'success') {
          // Login Sukses! Simpan data user ke local storage jika diperlukan
          localStorage.setItem('user_data', JSON.stringify(response.data));

          // Arahkan rute berdasarkan ROLE dari database
          const role = response.data.role;
          if (role === 'admin' || role === 'leader') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          // Jika status error (password salah dll)
          this.tampilAlert('Login Gagal', response.message);
        }
      },
      error: (err) => {
        console.error('Error HTTP:', err);
        this.tampilAlert('Error', 'Gagal terhubung ke server. Periksa koneksi internet Anda.');
      }
    });
  }

  // Helper untuk memunculkan popup alert
  async tampilAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}