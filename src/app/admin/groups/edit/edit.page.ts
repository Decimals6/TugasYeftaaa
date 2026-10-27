import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { UserService, LeaderOption, JamaahOption } from '../../../services/user';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: false
})
export class EditPage implements OnInit {
  groupId = 0;
  name = '';
  leaderId: number | null = null;
  description = '';

  leaders: LeaderOption[] = [];
  allJamaah: JamaahOption[] = [];
  selectedMemberSlots: (number | null)[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLeaders();
    this.loadInitialData();
  }

  loadLeaders() {
    this.userService.getLeaders().subscribe({
      next: (res) => { if (res.status === 'success' && res.data) this.leaders = res.data; }
    });
  }

  loadInitialData() {
    this.isLoading = true;
    // 1. Ambil detail grup & anggota aktif
    this.userService.getGroupDetail(this.groupId).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          const g = res.data.group;
          this.name = g.name;
          this.leaderId = g.leader_id;
          this.description = g.description !== '-' ? g.description : '';
          this.selectedMemberSlots = res.data.members.map(m => m.id);
        }

        // 2. Ambil pool jamaah (available + jamaah di grup ini)
        this.userService.getAvailableJamaah(this.groupId).subscribe({
          next: (jRes) => {
            this.isLoading = false;
            if (jRes.status === 'success' && jRes.data) {
              this.allJamaah = jRes.data;
            }
          },
          error: () => { this.isLoading = false; }
        });
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Gagal memuat data kelompok.', 'danger');
      }
    });
  }

  addMemberSlot() {
    if (this.selectedMemberSlots.length >= this.allJamaah.length) {
      this.showToast('Semua jamaah yang tersedia sudah dimasukkan.', 'warning');
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

  async onUpdate() {
    if (!this.name.trim()) {
      this.showToast('Nama kelompok wajib diisi!', 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({ message: 'Memperbarui kelompok...', spinner: 'crescent' });
    await loader.present();

    const validMemberIds = this.selectedMemberSlots.filter((id): id is number => id !== null);

    const payload = {
      id: this.groupId,
      name: this.name.trim(),
      leader_id: this.leaderId ? Number(this.leaderId) : null,
      description: this.description.trim(),
      member_ids: validMemberIds
    };

    this.userService.updateGroupWithMembers(payload).subscribe({
      next: async (res) => {
        await loader.dismiss();
        if (res.status === 'success') {
          this.showToast('Perubahan kelompok berhasil disimpan!', 'success');
          this.navCtrl.back();
        }
      },
      error: async (err) => {
        await loader.dismiss();
        this.showToast(err.error?.message || 'Gagal memperbarui kelompok.', 'danger');
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