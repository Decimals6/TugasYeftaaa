import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { UserService } from '../../../services/user';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false
})
export class CreatePage {
  name = '';
  usernameEmail = '';
  password = '';
  role = 'jamaah';

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async onSubmit() {
    if (!this.name.trim() || !this.usernameEmail.trim() || !this.password.trim() || !this.role) {
      this.showToast('Semua field formulir wajib diisi!', 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Menyimpan user...',
      spinner: 'crescent'
    });
    await loader.present();

    const payload = {
      name: this.name.trim(),
      username_email: this.usernameEmail.trim(),
      password: this.password.trim(),
      role: this.role
    };

    this.userService.createUser(payload).subscribe({
      next: async (res) => {
        await loader.dismiss();
        if (res.status === 'success') {
          this.showToast('User baru berhasil ditambahkan.', 'success');
          this.navCtrl.back();
        }
      },
      error: async (err) => {
        await loader.dismiss();
        this.showToast(err.error?.message || 'Gagal menyimpan user ke server.', 'danger');
      }
    });
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}