import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import * as L from 'leaflet';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  LeaderService,
  Jamaah,
  GroupInfo,
  LeaderUser,
  SubGroup,
  SearchResultItem
} from '../../services/leader';
import { AuthService, UserSession } from '../../auth.service';

interface BreadcrumbItem {
  label: string;
  level: 'kloter' | 'rombongan' | 'regu';
  groupId?: number;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false
})
export class MapsPage implements OnInit, OnDestroy {
  map!: L.Map;
  targetId: number | null = null;

  // Data pimpinan yang sedang login
  leaderId: number = 1;
  groupId: number = 1;
  userRole: string = 'leader';
  userName: string = 'Pemimpin';

  // Koordinat default (Makkah)
  lat: number = 21.4225;
  lon: number = 39.8262;

  // Layer & Marker Containers
  markerLeader!: L.Marker;
  markerLayerGroup: L.LayerGroup = L.layerGroup();

  // State Hierarki & Drill-Down
  activeLevel: 'kloter' | 'rombongan' | 'regu' = 'regu';
  selectedRombongan: SubGroup | null = null;
  selectedRegu: SubGroup | null = null;
  breadcrumbs: BreadcrumbItem[] = [];

  // Data Store dari API Radar
  groupInfo: GroupInfo | null = null;
  parentLeader: LeaderUser | null = null;
  subLeaders: LeaderUser[] = [];
  subGroups: SubGroup[] = [];
  jamaahList: Jamaah[] = [];

  // State Fitur Search Hierarki
  searchKeyword: string = '';
  searchResults: SearchResultItem[] = [];
  isSearching: boolean = false;
  showSearchResults: boolean = false;
  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  // Data list yang aktif tampil di slider bawah
  activeSlideItems: Array<{
    id: number;
    title: string;
    subtitle: string;
    roleLabel: string;
    lat: number | null;
    lon: number | null;
    lastSeen: string | null;
    type: 'parent' | 'sub_leader' | 'jamaah';
    raw?: any;
  }> = [];

  // Selected item yang sedang di-focus di peta
  selectedItemId: number | null = null;

  locationInterval: any;
  pollingInterval: any;

  // Custom SVG Markers
  private leaderIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="radar-marker marker-me"><div class="pulse-ring"></div><div class="marker-dot"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  private parentIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="radar-marker marker-parent"><ion-icon name="shield-checkmark"></ion-icon></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  private subLeaderIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="radar-marker marker-subleader"><ion-icon name="ribbon"></ion-icon></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  private jamaahIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="radar-marker marker-jamaah"><div class="jamaah-dot"></div></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

  private activeSelectedIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="radar-marker marker-focused"><div class="pulse-ring gold"></div><ion-icon name="pin"></ion-icon></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private leaderService: LeaderService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadUserData();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.targetId = parseInt(idParam, 10);
      this.selectedItemId = this.targetId;
    }

    // Inisialisasi RxJS debounce untuk search
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ionViewDidEnter() {
    this.initMap();
    this.fetchRadarData(true);
    this.startTrackingAndPolling();
  }

  ngOnDestroy() {
    if (this.locationInterval) clearInterval(this.locationInterval);
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    if (this.searchSub) this.searchSub.unsubscribe();
    if (this.map) this.map.remove();
  }

  private loadUserData() {
    const userStr = localStorage.getItem('user_session');
    if (userStr) {
      const u: UserSession = JSON.parse(userStr);
      this.leaderId = u.id;
      this.groupId = u.group_id || 1;
      this.userRole = u.role || 'leader';
      this.userName = u.name || 'Pemimpin';
    }
  }

  private initMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('radarMap', { zoomControl: false }).setView([this.lat, this.lon], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.markerLayerGroup.addTo(this.map);

    this.markerLeader = L.marker([this.lat, this.lon], { icon: this.leaderIcon }).addTo(this.map);
    this.markerLeader.bindPopup(`<b>${this.userName}</b><br>(Posisi Anda)`);

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  private startTrackingAndPolling() {
    this.updateCurrentPosition();

    this.locationInterval = setInterval(() => {
      this.updateCurrentPosition();
    }, 5000);

    this.pollingInterval = setInterval(() => {
      this.fetchRadarData(false);
    }, 5000);
  }

  private updateCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lon = pos.coords.longitude;
          if (this.markerLeader) {
            this.markerLeader.setLatLng([this.lat, this.lon]);
          }
          this.leaderService.updateLocation(this.leaderId, this.lat, this.lon).subscribe();
        },
        err => console.warn('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    }
  }

  fetchRadarData(autoFit: boolean = false) {
    let targetSubGroupId: number | undefined;
    let includeJamaah = 1;

    if (this.activeLevel === 'kloter') {
      includeJamaah = 0;
    } else if (this.activeLevel === 'rombongan') {
      includeJamaah = 0;
      if (this.selectedRombongan) {
        targetSubGroupId = this.selectedRombongan.id;
      }
    } else if (this.activeLevel === 'regu') {
      includeJamaah = 1;
      if (this.selectedRegu) {
        targetSubGroupId = this.selectedRegu.id;
      } else if (this.selectedRombongan) {
        targetSubGroupId = this.selectedRombongan.id;
      }
    }

    this.leaderService.getJamaahList(this.groupId, {
      leaderId: this.leaderId,
      subGroupId: targetSubGroupId,
      includeJamaah: includeJamaah
    }).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.groupInfo = res.group_info;
          this.parentLeader = res.parent_leader;
          this.subLeaders = res.sub_leaders || [];
          this.subGroups = res.sub_groups || [];
          this.jamaahList = res.data || [];

          if (this.breadcrumbs.length === 0) {
            this.setupInitialHierarchy();
          }

          this.renderMapMarkers(autoFit);
          this.updateActiveSlideItems();
        }
      },
      error: (err) => console.error('Gagal mengambil radar maps:', err)
    });
  }

  private setupInitialHierarchy() {
    const baseType = this.groupInfo?.type || 'regu';
    this.activeLevel = baseType;

    if (baseType === 'kloter') {
      this.breadcrumbs = [{ label: this.groupInfo?.name || 'Kloter', level: 'kloter', groupId: this.groupInfo?.id }];
    } else if (baseType === 'rombongan') {
      this.breadcrumbs = [{ label: this.groupInfo?.name || 'Rombongan', level: 'rombongan', groupId: this.groupInfo?.id }];
    } else {
      this.breadcrumbs = [{ label: this.groupInfo?.name || 'Regu', level: 'regu', groupId: this.groupInfo?.id }];
    }
  }

  renderMapMarkers(fitBounds: boolean = false) {
    if (!this.map) return;
    this.markerLayerGroup.clearLayers();

    const boundsPoints: L.LatLngExpression[] = [[this.lat, this.lon]];

    // A. Marker Atasan (Parent Leader)
    if (this.parentLeader && this.parentLeader.lat !== null && this.parentLeader.lon !== null) {
      const pLat = this.parentLeader.lat;
      const pLon = this.parentLeader.lon;
      boundsPoints.push([pLat, pLon]);

      const parentMarker = L.marker([pLat, pLon], {
        icon: this.selectedItemId === this.parentLeader.id ? this.activeSelectedIcon : this.parentIcon
      }).addTo(this.markerLayerGroup);

      parentMarker.bindPopup(`
        <div class="custom-popup">
          <span class="popup-badge atasan">Atasan</span>
          <h4>${this.parentLeader.name}</h4>
          <p>${this.parentLeader.group_name || 'Ketua Naungan'}</p>
        </div>
      `);

      parentMarker.on('click', () => {
        this.selectItem(this.parentLeader!.id, pLat, pLon);
      });
    }

    // B. Marker Sesuai Active Level
    if (this.activeLevel === 'kloter') {
      const rombonganLeaders = this.subLeaders.filter(sl => sl.group_type === 'rombongan');
      rombonganLeaders.forEach(sl => {
        if (sl.lat !== null && sl.lon !== null) {
          boundsPoints.push([sl.lat, sl.lon]);
          const m = L.marker([sl.lat, sl.lon], {
            icon: this.selectedItemId === sl.id ? this.activeSelectedIcon : this.subLeaderIcon
          }).addTo(this.markerLayerGroup);

          m.bindPopup(`
            <div class="custom-popup">
              <span class="popup-badge rombongan">Ketua Rombongan</span>
              <h4>${sl.name}</h4>
              <p>${sl.group_name}</p>
              <button class="btn-popup-drill" id="drill-rom-${sl.group_id}">Buka Regu</button>
            </div>
          `);

          m.on('popupopen', () => {
            const btn = document.getElementById(`drill-rom-${sl.group_id}`);
            if (btn) {
              btn.onclick = () => {
                this.drillDownToRombongan(sl);
              };
            }
          });

          m.on('click', () => this.selectItem(sl.id, sl.lat!, sl.lon!));
        }
      });
    } else if (this.activeLevel === 'rombongan') {
      const reguLeaders = this.subLeaders.filter(sl => {
        if (!this.selectedRombongan) return sl.group_type === 'regu';
        return sl.group_type === 'regu' && Number(sl.parent_group_id) === Number(this.selectedRombongan.id);
      });

      reguLeaders.forEach(sl => {
        if (sl.lat !== null && sl.lon !== null) {
          boundsPoints.push([sl.lat, sl.lon]);
          const m = L.marker([sl.lat, sl.lon], {
            icon: this.selectedItemId === sl.id ? this.activeSelectedIcon : this.subLeaderIcon
          }).addTo(this.markerLayerGroup);

          m.bindPopup(`
            <div class="custom-popup">
              <span class="popup-badge regu">Ketua Regu</span>
              <h4>${sl.name}</h4>
              <p>${sl.group_name}</p>
              <button class="btn-popup-drill" id="drill-regu-${sl.group_id}">Buka Jamaah</button>
            </div>
          `);

          m.on('popupopen', () => {
            const btn = document.getElementById(`drill-regu-${sl.group_id}`);
            if (btn) {
              btn.onclick = () => {
                this.drillDownToRegu(sl);
              };
            }
          });

          m.on('click', () => this.selectItem(sl.id, sl.lat!, sl.lon!));
        }
      });
    } else if (this.activeLevel === 'regu') {
      this.jamaahList.forEach(j => {
        if (j.lat !== null && j.lon !== null) {
          boundsPoints.push([j.lat, j.lon]);
          const isSelected = this.selectedItemId === j.id;
          const m = L.marker([j.lat, j.lon], {
            icon: isSelected ? this.activeSelectedIcon : this.jamaahIcon
          }).addTo(this.markerLayerGroup);

          m.bindPopup(`
            <div class="custom-popup">
              <span class="popup-badge jamaah">Jamaah</span>
              <h4>${j.name}</h4>
              <p>${j.group_name || 'Regu'}</p>
              <small>Aktif: ${j.last_located_at || '-'}</small>
            </div>
          `);

          m.on('click', () => this.selectItem(j.id, j.lat!, j.lon!));
        }
      });
    }

    if (fitBounds && boundsPoints.length > 1) {
      this.map.fitBounds(L.latLngBounds(boundsPoints as [number, number][]), { padding: [50, 50], maxZoom: 17 });
    }
  }

  private updateActiveSlideItems() {
    const list: typeof this.activeSlideItems = [];

    if (this.parentLeader) {
      list.push({
        id: this.parentLeader.id,
        title: this.parentLeader.name,
        subtitle: this.parentLeader.group_name || 'Atasan',
        roleLabel: this.parentLeader.group_type === 'kloter' ? 'Ketua Kloter' : 'Ketua Rombongan',
        lat: this.parentLeader.lat,
        lon: this.parentLeader.lon,
        lastSeen: this.parentLeader.last_located_at,
        type: 'parent',
        raw: this.parentLeader
      });
    }

    if (this.activeLevel === 'kloter') {
      const rombonganLeaders = this.subLeaders.filter(sl => sl.group_type === 'rombongan');
      rombonganLeaders.forEach(sl => {
        list.push({
          id: sl.id,
          title: sl.name,
          subtitle: sl.group_name || 'Rombongan',
          roleLabel: 'Ketua Rombongan',
          lat: sl.lat,
          lon: sl.lon,
          lastSeen: sl.last_located_at,
          type: 'sub_leader',
          raw: sl
        });
      });
    } else if (this.activeLevel === 'rombongan') {
      const reguLeaders = this.subLeaders.filter(sl => {
        if (!this.selectedRombongan) return sl.group_type === 'regu';
        return sl.group_type === 'regu' && Number(sl.parent_group_id) === Number(this.selectedRombongan.id);
      });
      reguLeaders.forEach(sl => {
        list.push({
          id: sl.id,
          title: sl.name,
          subtitle: sl.group_name || 'Regu',
          roleLabel: 'Ketua Regu',
          lat: sl.lat,
          lon: sl.lon,
          lastSeen: sl.last_located_at,
          type: 'sub_leader',
          raw: sl
        });
      });
    } else {
      this.jamaahList.forEach(j => {
        list.push({
          id: j.id,
          title: j.name,
          subtitle: j.group_name || 'Anggota Regu',
          roleLabel: 'Jamaah',
          lat: j.lat,
          lon: j.lon,
          lastSeen: j.last_located_at,
          type: 'jamaah',
          raw: j
        });
      });
    }

    this.activeSlideItems = list;

    if (this.targetId && !this.selectedItemId) {
      const match = list.find(i => i.id === this.targetId);
      if (match && match.lat !== null && match.lon !== null) {
        this.selectItem(match.id, match.lat, match.lon);
      }
    }
  }

  drillDownToRombongan(item: any) {
    let rombonganGroup: SubGroup | undefined;
    
    if (item && item.group_type === 'rombongan') {
      rombonganGroup = this.subGroups.find(g => Number(g.id) === Number(item.group_id)) || {
        id: Number(item.group_id),
        name: item.group_name || 'Rombongan',
        type: 'rombongan',
        parent_id: item.parent_group_id ? Number(item.parent_group_id) : null,
        parent_name: item.parent_group_name || null,
        leader_id: Number(item.id),
        leader_name: item.name
      };
    } else if (item && item.type === 'rombongan') {
      rombonganGroup = item;
    } else if (item && item.group_id) {
      rombonganGroup = this.subGroups.find(g => Number(g.id) === Number(item.group_id));
    } else if (item && item.id) {
      rombonganGroup = this.subGroups.find(g => Number(g.id) === Number(item.id));
    }

    if (!rombonganGroup) {
      console.warn('Grup Rombongan tidak ditemukan untuk drill-down:', item);
      return;
    }

    this.selectedRombongan = rombonganGroup;
    this.activeLevel = 'rombongan';
    this.breadcrumbs = [
      { label: this.groupInfo?.name || 'Kloter', level: 'kloter', groupId: this.groupInfo?.id },
      { label: rombonganGroup.name, level: 'rombongan', groupId: rombonganGroup.id }
    ];
    this.selectedItemId = null;
    this.fetchRadarData(true);
  }

  drillDownToRegu(item: any) {
    let reguGroup: SubGroup | undefined;

    if (item && item.group_type === 'regu') {
      reguGroup = this.subGroups.find(g => Number(g.id) === Number(item.group_id)) || {
        id: Number(item.group_id),
        name: item.group_name || 'Regu',
        type: 'regu',
        parent_id: item.parent_group_id ? Number(item.parent_group_id) : null,
        parent_name: item.parent_group_name || null,
        leader_id: Number(item.id),
        leader_name: item.name
      };
    } else if (item && item.type === 'regu') {
      reguGroup = item;
    } else if (item && item.group_id) {
      reguGroup = this.subGroups.find(g => Number(g.id) === Number(item.group_id));
    } else if (item && item.id) {
      reguGroup = this.subGroups.find(g => Number(g.id) === Number(item.id));
    }

    if (!reguGroup) {
      console.warn('Grup Regu tidak ditemukan untuk drill-down:', item);
      return;
    }

    this.selectedRegu = reguGroup;
    this.activeLevel = 'regu';

    if (this.groupInfo?.type === 'kloter' && this.selectedRombongan) {
      this.breadcrumbs = [
        { label: this.groupInfo.name, level: 'kloter', groupId: this.groupInfo.id },
        { label: this.selectedRombongan.name, level: 'rombongan', groupId: this.selectedRombongan.id },
        { label: reguGroup.name, level: 'regu', groupId: reguGroup.id }
      ];
    } else {
      this.breadcrumbs = [
        { label: this.groupInfo?.name || 'Rombongan', level: 'rombongan', groupId: this.groupInfo?.id },
        { label: reguGroup.name, level: 'regu', groupId: reguGroup.id }
      ];
    }

    this.selectedItemId = null;
    this.fetchRadarData(true);
  }

  navigateBreadcrumb(index: number) {
    if (index === this.breadcrumbs.length - 1) return;

    const target = this.breadcrumbs[index];
    if (target.level === 'kloter') {
      this.selectedRombongan = null;
      this.selectedRegu = null;
      this.activeLevel = 'kloter';
      this.breadcrumbs = [this.breadcrumbs[0]];
    } else if (target.level === 'rombongan') {
      this.selectedRegu = null;
      this.activeLevel = 'rombongan';
      this.breadcrumbs = this.breadcrumbs.slice(0, 2);
    }
    this.selectedItemId = null;
    this.fetchRadarData(true);
  }

  selectItem(id: number, lat: number | null, lon: number | null) {
    this.selectedItemId = id;
    if (lat !== null && lon !== null && this.map) {
      this.map.flyTo([lat, lon], 17, { duration: 0.8 });
    }
    this.renderMapMarkers(false);
  }

  centerToMyPosition() {
    if (this.map) {
      this.selectedItemId = null;
      this.map.flyTo([this.lat, this.lon], 17, { duration: 0.8 });
      this.renderMapMarkers(false);
    }
  }

  goToJamaahDetail(userId: number) {
    this.router.navigate(['/leader/jamaah', userId]);
  }

  goBack() {
    this.navCtrl.back();
  }

  // ===================== LOGIKA FITUR SEARCH HIERARKI =====================

  onSearchInput(event: any) {
    const val = event.target.value;
    this.searchKeyword = val ? val.trim() : '';
    if (this.searchKeyword.length >= 2) {
      this.showSearchResults = true;
      this.isSearching = true;
      this.searchSubject.next(this.searchKeyword);
    } else {
      this.searchResults = [];
      this.isSearching = false;
      if (this.searchKeyword.length === 0) {
        this.showSearchResults = false;
      }
    }
  }

  private performSearch(query: string) {
    if (!query || query.length < 2) {
      this.isSearching = false;
      return;
    }

    this.leaderService.searchHierarchy(this.groupId, query).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.searchResults = res.data || [];
        } else {
          this.searchResults = [];
        }
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Error saat search hierarchy:', err);
        this.searchResults = [];
        this.isSearching = false;
      }
    });
  }

  clearSearch() {
    this.searchKeyword = '';
    this.searchResults = [];
    this.showSearchResults = false;
    this.isSearching = false;
  }

  selectSearchResult(item: SearchResultItem) {
    this.showSearchResults = false;

    // 1. Jika memilih Kelompok Rombongan atau Ketua Rombongan
    if (item.category === 'rombongan' || (item.category === 'leader' && item.roleLabel.toLowerCase().includes('rombongan'))) {
      this.drillDownToRombongan({
        id: item.group_id,
        name: item.group_name,
        type: 'rombongan',
        parent_id: item.parent_group_id || null,
        parent_name: item.parent_group_name || null,
        leader_id: item.type === 'user' ? item.id : null,
        leader_name: item.name
      });
      if (item.lat !== null && item.lon !== null) {
        setTimeout(() => this.selectItem(item.id, item.lat, item.lon), 400);
      }
      return;
    }

    // 2. Jika memilih Kelompok Regu atau Ketua Regu
    if (item.category === 'regu' || (item.category === 'leader' && item.roleLabel.toLowerCase().includes('regu'))) {
      if (this.groupInfo?.type === 'kloter' && item.parent_group_id) {
        this.selectedRombongan = {
          id: Number(item.parent_group_id),
          name: item.parent_group_name || 'Rombongan',
          type: 'rombongan',
          parent_id: this.groupInfo.id,
          parent_name: this.groupInfo.name,
          leader_id: null,
          leader_name: ''
        };
      }

      this.drillDownToRegu({
        id: item.group_id,
        name: item.group_name,
        type: 'regu',
        parent_id: item.parent_group_id || null,
        parent_name: item.parent_group_name || null,
        leader_id: item.type === 'user' ? item.id : null,
        leader_name: item.name
      });
      if (item.lat !== null && item.lon !== null) {
        setTimeout(() => this.selectItem(item.id, item.lat, item.lon), 400);
      }
      return;
    }

    // 3. Jika memilih Jamaah (Auto-Drilldown ke Regu & Sorot Pin Jamaah)
    if (item.category === 'jamaah') {
      const targetReguId = Number(item.group_id);
      const reguName = item.group_name || 'Regu';
      const parentRombonganId = item.parent_group_id ? Number(item.parent_group_id) : null;
      const parentRombonganName = item.parent_group_name || 'Rombongan';

      this.selectedRegu = {
        id: targetReguId,
        name: reguName,
        type: 'regu',
        parent_id: parentRombonganId,
        parent_name: parentRombonganName,
        leader_id: null,
        leader_name: ''
      };

      if (this.groupInfo?.type === 'kloter' && parentRombonganId) {
        this.selectedRombongan = {
          id: parentRombonganId,
          name: parentRombonganName,
          type: 'rombongan',
          parent_id: this.groupInfo.id,
          parent_name: this.groupInfo.name,
          leader_id: null,
          leader_name: ''
        };
        this.breadcrumbs = [
          { label: this.groupInfo.name, level: 'kloter', groupId: this.groupInfo.id },
          { label: parentRombonganName, level: 'rombongan', groupId: parentRombonganId },
          { label: reguName, level: 'regu', groupId: targetReguId }
        ];
      } else if (this.groupInfo?.type === 'rombongan') {
        this.breadcrumbs = [
          { label: this.groupInfo.name, level: 'rombongan', groupId: this.groupInfo.id },
          { label: reguName, level: 'regu', groupId: targetReguId }
        ];
      } else {
        this.breadcrumbs = [
          { label: reguName, level: 'regu', groupId: targetReguId }
        ];
      }

      this.activeLevel = 'regu';
      this.selectedItemId = item.id;

      // Load data regu terpilih (hanya ~10 jamaah) on-demand
      this.fetchRadarData(false);

      // Terbang ke lokasi koordinat jamaah jika GPS aktif
      if (item.lat !== null && item.lon !== null && this.map) {
        this.map.flyTo([item.lat, item.lon], 18, { duration: 1.0 });
      }
    }
  }
}
