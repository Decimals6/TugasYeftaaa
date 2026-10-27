import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { UserService, GroupDetailResponse } from '../../../services/user';

@Component({
  selector: 'app-detail-group',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false
})
export class DetailPage implements OnInit {
  groupId = 0;
  detailData: GroupDetailResponse | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ionViewWillEnter() {
    this.fetchDetail();
  }

  fetchDetail() {
    this.isLoading = true;
    this.userService.getGroupDetail(this.groupId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'success' && res.data) {
          this.detailData = res.data;
        }
      },
      error: async (err) => {
        this.isLoading = false;
        const toast = await this.toastCtrl.create({
          message: err.error?.message || 'Gagal mengambil detail kelompok.',
          duration: 2500,
          color: 'danger',
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

  editThisGroup() {
    this.navCtrl.navigateForward(`/admin/groups/edit/${this.groupId}`);
  }

  goBack() {
    this.navCtrl.back();
  }
}