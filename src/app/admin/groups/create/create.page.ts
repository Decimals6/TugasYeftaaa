import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { UserService, LeaderOption, JamaahOption } from '../../../services/user';

@Component({
  selector: 'app-create-group',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false
})
export class CreatePage implements OnInit {
  name = '';
  leaderId: number | null = null;
  description = '';

  leaders: LeaderOption[] = [];
  allJamaah: JamaahOption[] = [];
  selectedMemberSlots: (number | null)[] = [];

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadLeaders();
    this.loadAvailableJamaah();
  }

  loadLeaders() {
    this.userService.getLeaders().subscribe({
      next: (res) => { if (res.status === 'success' && res.data) this.leaders = res.data; }
    });
  }

  loadAvailableJamaah() {
    this.userService.getAvailableJamaah().subscribe({
      next: (res) => { if (res.status === 'success' && res.data) this.allJamaah = res.data; }
    });
  }

  // Tambah baris dropdown slot anggota
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

  // Filter daftar dropdown agar user yang sudah dipilih tidak muncul di slot lain
  getAvailableForSlot(currentIndex: number): JamaahOption[] {
    const selectedElsewhere = this.selectedMemberSlots.filter((id, idx) => idx !== currentIndex && id !== null);
    return this.allJamaah.filter(j => !selectedElsewhere.includes(j.id));
  }

  async onSubmit() {
    if (!this.name.trim()) {
      this.showToast('Nama kelompok wajib diisi!', 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({ message: 'Menyimpan kelompok...', spinner: 'crescent' });
    await loader.present();

    // Saring ID yang valid (bukan null)
    const validMemberIds = this.selectedMemberSlots.filter((id): id is number => id !== null);

    const payload = {
      name: this.name.trim(),
      leader_id: this.leaderId ? Number(this.leaderId) : null,
      description: this.description.trim(),
      member_ids: validMemberIds
    };

    this.userService.createGroupWithMembers(payload).subscribe({
      next: async (res) => {
        await loader.dismiss();
        if (res.status === 'success') {
          this.showToast('Kelompok dan anggota berhasil dibuat!', 'success');
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