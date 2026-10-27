import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { interval, Subscription, firstValueFrom } from 'rxjs';
import { TempatserviceService } from '../tempatservice.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-teskoor',
  templateUrl: './teskoor.page.html',
  styleUrls: ['./teskoor.page.scss'],
  standalone: false,
})
export class TeskoorPage implements OnInit, OnDestroy {
  lat: number = 0;
  lon: number = 0;
  accuracy: number = 0;

  leaderLat: number | null = null;
  leaderLon: number | null = null;
  leaderName: string = '';

  map: any;
  markerUser: any;
  markerLeader: any;
  timerSubscription: Subscription | undefined;
  isInit = false;
  currentUser: any = null;

  constructor(
    private tempatService: TempatserviceService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      const raw = localStorage.getItem('user_session');
      if (raw) this.currentUser = JSON.parse(raw);
    }

    this.getCoordinates();
    await this.fetchLeaderLocation();
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          this.accuracy = position.coords.accuracy || 0;

          if (!this.isInit) {
            this.initializeMap();
            this.isInit = true;
            this.startLiveTracking();
          } else {
            this.updateUserMarker();
          }
        },
        (error) => {
          console.error('Error saat membaca koordinat GPS:', error);
          if (!this.isInit) {
            this.lat = 21.4225;
            this.lon = 39.8262;
            this.initializeMap();
            this.isInit = true;
            this.startLiveTracking();
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }

  initializeMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map', { zoomControl: false }).setView([this.lat, this.lon], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // Marker User Jamaah (Dot Biru + Pulse)
    const userDotIcon = L.divIcon({
      className: 'user-dot-wrapper',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      html: `
        <div class="user-core-pulse"></div>
        <div class="user-core-dot"></div>
      `
    });

    this.markerUser = L.marker([this.lat, this.lon], { icon: userDotIcon, zIndexOffset: 500 }).addTo(this.map);
    this.markerUser.bindTooltip('<b>Posisi Anda</b>', { direction: 'top', offset: [0, -12] });

    if (this.leaderLat && this.leaderLon) {
      this.renderLeaderMarker();
    }
  }

  async fetchLeaderLocation() {
    const userId = this.currentUser?.id;
    if (!userId) return;

    try {
      const res = await firstValueFrom(this.tempatService.getLeaderLocation(userId));
      if (res?.status === 'success' && res.data) {
        this.leaderName = res.data.leader_name;
        this.leaderLat = res.data.lat;
        this.leaderLon = res.data.lon;

        if (this.map && this.leaderLat && this.leaderLon) {
          this.renderLeaderMarker();
        }
      }
    } catch (err) {
      console.warn('Gagal mengambil data posisi leader:', err);
    }
  }

  renderLeaderMarker() {
    if (!this.leaderLat || !this.leaderLon || !this.map) return;

    const leaderBeaconIcon = L.divIcon({
      className: 'leader-beacon-pin',
      iconSize: [44, 44],
      iconAnchor: [22, 38],
      html: `
        <div class="leader-pin-wrapper">
          <div class="leader-pin-badge">
            <div class="pin-pulse"></div>
            <div class="pin-body">
              <svg class="leader-svg-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
        </div>
      `
    });

    if (this.markerLeader) {
      this.markerLeader.setLatLng([this.leaderLat, this.leaderLon]);
    } else {
      this.markerLeader = L.marker([this.leaderLat, this.leaderLon], {
        icon: leaderBeaconIcon,
        zIndexOffset: 1000
      }).addTo(this.map);

      this.markerLeader.bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <b style="color: #0b4635; font-size: 14px;">${this.leaderName}</b><br>
          <span style="font-size: 11px; color: #c5a059; font-weight: bold;">PEMBIMBING IBADAH</span><br>
          <small style="color: #6b7280;">Ikuti rombongan pembimbing ini</small>
        </div>
      `);
    }
  }

  startLiveTracking() {
    this.timerSubscription = interval(3000).subscribe(() => {
      this.getCoordinates();
      this.fetchLeaderLocation();
    });
  }

  updateUserMarker() {
    if (this.markerUser) {
      this.markerUser.setLatLng([this.lat, this.lon]);
    }
  }

  centerToUser() {
    if (this.map && this.lat && this.lon) {
      this.map.flyTo([this.lat, this.lon], 18, { duration: 0.8 });
    }
  }

  focusLeader() {
    if (this.map && this.leaderLat && this.leaderLon) {
      this.map.flyTo([this.leaderLat, this.leaderLon], 18, { duration: 0.8 });
      if (this.markerLeader) {
        this.markerLeader.openPopup();
      }
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ionViewWillLeave() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}