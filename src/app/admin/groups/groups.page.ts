import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { UserService } from '../../services/user';

export interface GroupItem {
  id: number;
  name: string;
  leaderId: number | null;
  leaderName: string;
  totalJamaah: number;
  keterangan: string;
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: false
})
export class GroupsPage {
  groups: GroupItem[] = [];
  isLoading = false;

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.fetchGroups();
  }

  fetchGroups() {
    this.isLoading = true;
    this.userService.getGroups().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'success' && Array.isArray(res.data)) {
          this.groups = res.data.map((item) => ({
            id: item.id,
            name: item.name,
            leaderId: item.leader_id,
            leaderName: item.leader_name,
            totalJamaah: item.total_jamaah,
            keterangan: item.description
          }));
        }
      },
      error: async (err) => {
        this.isLoading = false;
        const toast = await this.toastCtrl.create({
          message: err.error?.message || 'Gagal memuat data kelompok.',
          duration: 2500,
          color: 'danger',
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

  createGroup() {
    this.navCtrl.navigateForward('/admin/groups/create');
  }

  detailGroup(group: GroupItem) {
    this.navCtrl.navigateForward(`/admin/groups/detail/${group.id}`, {
      state: { groupData: group }
    });
  }

  editGroup(group: GroupItem) {
    this.navCtrl.navigateForward(`/admin/groups/edit/${group.id}`, {
      state: { groupData: group }
    });
  }
}