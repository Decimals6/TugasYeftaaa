import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaderService, Jamaah } from '../../services/leader';
import * as L from 'leaflet';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false
})
export class MapsPage implements OnInit, OnDestroy {
  map!: L.Map;
  groupId: number = 1;
  leaderId: number = 0;
  leaderName: string = 'Leader (Saya)';
  leaderLat: number | null = null;
  leaderLon: number | null = null;
  markerLeader: L.Marker | null = null;

  jamaahList: Jamaah[] = [];
  selectedUserId: number | null = null;
  markerMap: Map<number, L.Marker> = new Map();

  // Custom DivIcon Jamaah Biasa (Dot Biru)
  normalDotIcon = L.divIcon({
    className: 'custom-dot-wrapper',
    html: '<div class="user-dot"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  // Custom DivIcon Jamaah Terpilih (Pin Gold)
  selectedPinIcon = L.divIcon({
    className: 'custom-pin-wrapper',
    html: '<div class="user-pin-active"><i class="pin-head"></i></div>',
    iconSize: [36, 46],
    iconAnchor: [18, 46]
  });

  // Custom DivIcon Khusus Leader (Pin Hijau Emerald + Icon Person)
  leaderPinIcon = L.divIcon({
    className: 'leader-pin-wrapper',
    html: `
      <div class="leader-pin-badge">
        <div class="pin-pulse"></div>
        <div class="pin-body">
          <svg viewBox="0 0 24 24" class="leader-svg-icon" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [42, 54],
    iconAnchor: [21, 52]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leaderService: LeaderService
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      this.groupId = u.group_id || 1;
      this.leaderId = u.id || 0;
      this.leaderName = u.name || 'Leader (Saya)';
      if (u.lat && u.lon) {
        this.leaderLat = Number(u.lat);
        this.leaderLon = Number(u.lon);
      }
    }

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.selectedUserId = Number(paramId);
    }
  }

  ionViewDidEnter() {
    this.initMap();
    this.fetchCurrentLeaderLocation();
    this.loadJamaahLocations();
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  initMap() {
    if (this.map) this.map.remove();

    const initialLat = this.leaderLat || 21.4225;
    const initialLon = this.leaderLon || 39.8262;

    this.map = L.map('fullMap', { zoomControl: false }).setView([initialLat, initialLon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.map);
  }

  fetchCurrentLeaderLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.leaderLat = pos.coords.latitude;
          this.leaderLon = pos.coords.longitude;
          this.renderLeaderMarker();
        },
        () => {
          if (this.leaderLat && this.leaderLon) {
            this.renderLeaderMarker();
          }
        },
        { enableHighAccuracy: true }
      );
    } else if (this.leaderLat && this.leaderLon) {
      this.renderLeaderMarker();
    }
  }

  renderLeaderMarker() {
    if (!this.leaderLat || !this.leaderLon || !this.map) return;

    if (this.markerLeader) {
      this.markerLeader.setLatLng([this.leaderLat, this.leaderLon]);
    } else {
      this.markerLeader = L.marker([this.leaderLat, this.leaderLon], {
        icon: this.leaderPinIcon,
        zIndexOffset: 1000
      }).addTo(this.map);

      this.markerLeader.bindTooltip(`<b>${this.leaderName}</b><br><small style="color:#0b4635;">Posisi Anda</small>`, {
        direction: 'top',
        offset: [0, -48]
      });
    }
  }

  loadJamaahLocations() {
    this.leaderService.getJamaahList(this.groupId).subscribe(res => {
      if (res.status === 'success') {
        this.jamaahList = res.data;
        this.renderMarkers();

        if (this.selectedUserId) {
          this.selectUser(this.selectedUserId);
        }
      }
    });
  }

  renderMarkers() {
    this.markerMap.forEach(m => m.remove());
    this.markerMap.clear();

    const bounds = L.latLngBounds([]);

    if (this.leaderLat && this.leaderLon) {
      bounds.extend([this.leaderLat, this.leaderLon]);
    }

    this.jamaahList.forEach(j => {
      if (j.lat && j.lon) {
        const isSelected = j.id === this.selectedUserId;
        const marker = L.marker([j.lat, j.lon], {
          icon: isSelected ? this.selectedPinIcon : this.normalDotIcon
        }).addTo(this.map);

        marker.on('click', () => {
          this.selectUser(j.id);
        });

        this.markerMap.set(j.id, marker);
        bounds.extend([j.lat, j.lon]);
      }
    });

    if (!this.selectedUserId) {
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
      }
    }
  }

  focusLeader() {
    if (this.leaderLat && this.leaderLon) {
      this.map.flyTo([this.leaderLat, this.leaderLon], 17, { duration: 0.8 });
      if (this.markerLeader) {
        this.markerLeader.openTooltip();
      }
    }
  }

  selectUser(userId: number) {
    const prevSelectedId = this.selectedUserId;
    this.selectedUserId = userId;

    if (prevSelectedId && this.markerMap.has(prevSelectedId)) {
      this.markerMap.get(prevSelectedId)!.setIcon(this.normalDotIcon);
    }

    if (this.markerMap.has(userId)) {
      const marker = this.markerMap.get(userId)!;
      marker.setIcon(this.selectedPinIcon);
      this.map.flyTo(marker.getLatLng(), 17, { duration: 0.8 });
    }

    const elem = document.getElementById(`jamaah-card-${userId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  goToDetail(id: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/leader/jamaah', id]);
  }
}