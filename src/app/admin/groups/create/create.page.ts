import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { UserService, LeaderOption, JamaahOption, GroupType, GroupResponseItem } from '../../../services/user';

@Component({
  selector: 'app-create-group',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false
})
export class CreatePage implements OnInit {
  name = '';
  type: GroupType = 'regu';
  parentId: number | null = null;
  leaderId: number | null = null;
  description = '';

  ibadahType: 'haji' | 'umrah' = 'haji';
  leaders: LeaderOption[] = [];
  
  // Untuk Regu
  allJamaah: JamaahOption[] = [];
  selectedMemberSlots: (number | null)[] = [];

  // Untuk Kloter / Rombongan (Sub-groups)
  availableSubGroups: GroupResponseItem[] = [];
  selectedSubGroupIds: number[] = [];

  // Parent Group Options (filtered by ibadah_type and valid hierarchy parent)
  parentGroupOptions: GroupResponseItem[] = [];

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loadDependentData();
  }

  onTypeOrIbadahChange() {
    this.leaderId = null;
    this.parentId = null;
    this.selectedMemberSlots = [];
    this.selectedSubGroupIds = [];
    this.loadDependentData();
  }

  loadDependentData() {
    this.loadLeaders();
    this.loadParentOptions();
    if (this.type === 'regu') {
      this.loadAvailableJamaah();
    } else {
      this.loadAvailableSubGroups();
    }
  }

  loadLeaders() {
    this.userService.getLeaders(this.ibadahType, this.type).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          this.leaders = res.data;
        }
      }
    });
  }

  loadParentOptions() {
    this.userService.getGroups().subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          const targetParentType = this.type === 'regu' ? 'rombongan' : (this.type === 'rombongan' ? 'kloter' : null);
          this.parentGroupOptions = res.data.filter(g => g.ibadah_type === this.ibadahType && g.type === targetParentType);
        }
      }
    });
  }

  loadAvailableJamaah() {
    this.userService.getAvailableJamaah(this.ibadahType).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          this.allJamaah = res.data;
        }
      }
    });
  }

  loadAvailableSubGroups() {
    this.userService.getGroups().subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          const targetSubType = this.type === 'kloter' ? 'rombongan' : 'regu';
          // Ambil kelompok sub yang ibadah sama dan belum punya parent (atau parent null)
          this.availableSubGroups = res.data.filter(g => g.ibadah_type === this.ibadahType && g.type === targetSubType);
        }
      }
    });
  }

  addMemberSlot() {
    if (this.selectedMemberSlots.length >= this.allJamaah.length) {
      this.showToast('Tidak ada lagi jamaah yang tersedia.', 'warning');
      return;
    }
    this.selectedMemberSlots.push(null);
  }

  removeMemberSlot(index: number) {
    this.selectedMemberSlots.splice(index, 1);
  }

  getAvailableForSlot(currentIndex: number): JamaahOption[] {
    const selectedElsewhere = this.selectedMemberSlots.filter((id, idx) => idx !== currentIndex && id !== null);
    return this.allJamaah.filter(j => !selectedElsewhere.includes(j.id));
  }

  toggleSubGroup(subId: number) {
    const idx = this.selectedSubGroupIds.indexOf(subId);
    if (idx > -1) {
      this.selectedSubGroupIds.splice(idx, 1);
    } else {
      this.selectedSubGroupIds.push(subId);
    }
  }

  async onSubmit() {
    if (!this.name.trim()) {
      this.showToast('Nama kelompok wajib diisi!', 'warning');
      return;
    }

    if (this.type === 'regu' && !this.parentId) {
      this.showToast('Regu wajib memilih Rombongan Induk!', 'warning');
      return;
    }

    if (this.type === 'rombongan' && !this.parentId) {
      this.showToast('Rombongan wajib memilih Kloter Induk!', 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({ message: 'Menyimpan kelompok...', spinner: 'crescent' });
    await loader.present();

    const validMemberIds = this.type === 'regu' ? this.selectedMemberSlots.filter((id): id is number => id !== null) : [];

    const payload = {
      name: this.name.trim(),
      type: this.type,
      parent_id: this.type === 'kloter' ? null : (this.parentId ? Number(this.parentId) : null),
      ibadah_type: this.ibadahType,
      leader_id: this.leaderId ? Number(this.leaderId) : null,
      description: this.description.trim(),
      member_ids: validMemberIds,
      sub_group_ids: this.selectedSubGroupIds
    };

    this.userService.createGroup(payload).subscribe({
      next: async (res) => {
        await loader.dismiss();
        if (res.status === 'success') {
          this.showToast('Kelompok berhasil dibuat!', 'success');
          this.navCtrl.back();
        }
      },
      error: async (err) => {
        await loader.dismiss();
        this.showToast(err.error?.message || 'Gagal menyimpan.', 'danger');
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2500, color, position: 'bottom' });
    toast.present();
  }
}