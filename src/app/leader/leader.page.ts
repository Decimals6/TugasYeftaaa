import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderService, Jamaah } from '../services/leader';
import * as L from 'leaflet';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service'; // Sesuaikan path auth service kamu

@Component({
  selector: 'app-leader',
  templateUrl: './leader.page.html',
  styleUrls: ['./leader.page.scss'],
  standalone: false
})
export class LeaderPage implements OnInit, OnDestroy {
  map!: L.Map;
  markerLeader!: L.Marker;
  lat: number = 21.4225; // Default Makkah / Mecca
  lon: number = 39.8262;
  leaderId: number = 1; // Tarik dari AuthService / LocalStorage
  groupId: number = 1;

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
    this.fetchJamaah();
  }

  ngOnDestroy() {
    if (this.locationInterval) clearInterval(this.locationInterval);
    if (this.map) this.map.remove();
  }
  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar dari akun admin?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Keluar',
          role: 'destructive',
          handler: () => {
            // 2. Hapus sesi via service
            this.authService.logout();

            // 3. Bersihkan juga sisa key lama kalau masih ada
            localStorage.removeItem('user_data');

            // 4. Arahkan balik ke login (atau welcome)
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    await alert.present();
  }

  loadUserData() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      this.leaderId = u.id;
      this.groupId = u.group_id;
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

  fetchJamaah() {
    this.leaderService.getJamaahList(this.groupId).subscribe(res => {
      if (res.status === 'success') {
        this.jamaahList = res.data;
      }
    });
  }

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