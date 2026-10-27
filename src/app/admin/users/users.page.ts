import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { UserService } from '../../services/user';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'leader' | 'jamaah';
  groupName?: string;
  latitude?: number | null;
  longitude?: number | null;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false

})
export class UsersPage {
  users: UserRow[] = [];
  isLoading = false;

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ionViewWillEnter() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'success' && Array.isArray(res.data)) {
          // Mapping field dari API ke format property yang dipakai di template HTML kamu
          this.users = res.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            email: item.username_email,
            role: item.role,
            groupName: item.group_name || (item.group_id ? `Kelompok ${item.group_id}` : '-'),
            latitude: item.lat,
            longitude: item.lon
          }));
        }
      },
      error: async (err) => {
        this.isLoading = false;
        const toast = await this.toastCtrl.create({
          message: err.error?.message || 'Gagal mengambil data user dari server.',
          duration: 2500,
          color: 'danger',
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

  // Sesuai dengan tombol (click)="addUser()" di HTML
  addUser() {
    this.navCtrl.navigateForward('/admin/users/create');
  }

  // Handler tombol aksi Lokasi
  cekLokasi(user: UserRow) {
    if (!user.latitude || !user.longitude) {
      this.showToast(`Koordinat ${user.name} belum tersedia.`);
      return;
    }
    // Arahkan ke peta atau modal preview peta
    console.log(`Lokasi ${user.name}:`, user.latitude, user.longitude);
  }

  // Handler tombol aksi Edit
  editUser(user: UserRow) {
    this.navCtrl.navigateForward(`/admin/users/edit/${user.id}`, {
      state: { userData: user }
    });
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}