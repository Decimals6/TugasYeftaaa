import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderService, Jamaah, GroupInfo, LeaderUser, SubGroup } from '../services/leader';
import * as L from 'leaflet';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService, UserSession } from '../auth.service';

@Component({
  selector: 'app-leader',
  templateUrl: './leader.page.html',
  styleUrls: ['./leader.page.scss'],
  standalone: false
})
export class LeaderPage implements OnInit, OnDestroy {
  map!: L.Map;
  markerLeader!: L.Marker;
  lat: number = 21.4225; // Default Makkah
  lon: number = 39.8262;
  leaderId: number = 1;
  groupId: number = 1;
  userRole: string = 'leader';
  userName: string = 'Pemimpin';

  groupInfo: GroupInfo | null = null;
  parentLeader: LeaderUser | null = null;
  subLeaders: LeaderUser[] = [];
  subGroups: SubGroup[] = [];
  jamaahList: Jamaah[] = [];

  locationInterval: any;

  constructor(
    private leaderService: LeaderService,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.startTracking();
  }

  ionViewDidEnter() {
    this.initMiniMap();
    this.fetchLeaderDashboard();
  }

  ngOnDestroy() {
    if (this.locationInterval) clearInterval(this.locationInterval);
    if (this.map) this.map.remove();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar dari akun pembimbing?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Keluar',
          role: 'destructive',
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

  loadUserData() {
    const userStr = localStorage.getItem('user_session');
    if (userStr) {
      const u: UserSession = JSON.parse(userStr);
      this.leaderId = u.id;
      this.groupId = u.group_id || 1;
      this.userRole = u.role || 'leader';
      this.userName = u.name || 'Pemimpin';
    }
  }

  startTracking() {
    this.updateCurrentPosition();
    this.locationInterval = setInterval(() => {
      this.updateCurrentPosition();
    }, 5000);
  }

  updateCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lon = pos.coords.longitude;
          if (this.markerLeader) {
            this.markerLeader.setLatLng([this.lat, this.lon]);
            this.map.panTo([this.lat, this.lon]);
          }
          this.leaderService.updateLocation(this.leaderId, this.lat, this.lon).subscribe();
        },
        err => console.warn('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    }
  }

  initMiniMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('miniMap', { zoomControl: false }).setView([this.lat, this.lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    const leaderIcon = L.icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    this.markerLeader = L.marker([this.lat, this.lon], { icon: leaderIcon }).addTo(this.map);
    setTimeout(() => this.map.invalidateSize(), 300);
  }

  fetchLeaderDashboard() {
    this.leaderService.getJamaahList(this.groupId, { leaderId: this.leaderId }).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.groupInfo = res.group_info;
          this.parentLeader = res.parent_leader;
          this.subLeaders = res.sub_leaders || [];
          this.subGroups = res.sub_groups || [];
          this.jamaahList = res.data || [];
        }
      },
      error: (err) => console.error('Gagal mengambil dashboard leader:', err)
    });
  }

  // Helpers untuk title & badge sesuai kasta
  getRoleBadge(): string {
    if (this.groupInfo?.type === 'kloter' || this.userRole === 'ketua_kloter') return 'Ketua Kloter';
    if (this.groupInfo?.type === 'rombongan' || this.userRole === 'ketua_rombongan') return 'Ketua Rombongan';
    if (this.groupInfo?.type === 'regu' || this.userRole === 'ketua_regu') return 'Ketua Regu';
    return 'Pembimbing Mutowif';
  }

  getParentRoleLabel(): string {
    if (this.parentLeader?.group_type === 'kloter') return 'Ketua Kloter Anda';
    if (this.parentLeader?.group_type === 'rombongan') return 'Ketua Rombongan Anda';
    return 'Pimpinan Naungan';
  }

  // Dapatkan daftar sub-groups yang cocok dengan level di bawahnya langsung
  getDirectSubGroups(): SubGroup[] {
    if (this.groupInfo?.type === 'kloter') {
      return this.subGroups.filter(s => s.type === 'rombongan');
    }
    if (this.groupInfo?.type === 'rombongan') {
      return this.subGroups.filter(s => s.type === 'regu');
    }
    return [];
  }

  getSubLeaderByGroupId(groupId: number): LeaderUser | undefined {
    return this.subLeaders.find(l => l.group_id === groupId);
  }

  // Navigasi
  goToMaps() {
    this.router.navigate(['/leader/maps']);
  }

  goToMapsWithUser(id: number) {
    this.router.navigate(['/leader/maps', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/leader/jamaah', id]);
  }
}
