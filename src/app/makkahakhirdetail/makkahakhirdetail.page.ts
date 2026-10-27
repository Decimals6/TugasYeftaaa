import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { interval, Subscription, firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TempatserviceService } from '../tempatservice.service';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-makkahakhirdetail',
  templateUrl: './makkahakhirdetail.page.html',
  styleUrls: ['./makkahakhirdetail.page.scss'],
  standalone: false,
})
export class MakkahakhirdetailPage implements OnInit {
  lat: number = 0;
  lon: number = 0;
  map: any;
  markerLokasi: any;
  markerUser: any;
  timerSubscription: Subscription | undefined;
  isInit = false;
  count = 0;
  rute1: any;
  rute2: any;
  rute3: any;
  rute4: any;
  putaran = 0;
  pos = 0;

  id1: number = 0;
  id2: number = 0;
  tempat: any = {};
  currentUser: any = null;

  urutanKunjungan: number[] = [];
  jalurPolyline: any = null;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private tempatService: TempatserviceService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.loadUserData();

    this.route.params.subscribe(async params => {
      this.id1 = +params['index1'];
      this.id2 = +params['index2'];

      // Ambil data lokasi & rute aktif
      const data = await this.tempatService.initData();
      const targetLocation = data.find((t: any) => t.id === this.id1);
      this.tempat = targetLocation?.list?.find((item: any) => item.id === this.id2)
        || targetLocation?.list?.[this.id2]
        || {};

      this.getCoordinates();
    });
  }

  loadUserData() {
    // Ambil langsung via service
    this.currentUser = this.authService.getCurrentUser();

    // Fallback cadangan jika service belum terinisialisasi
    if (!this.currentUser) {
      const raw = localStorage.getItem('user_session');
      if (raw) {
        this.currentUser = JSON.parse(raw);
      }
    }

    console.log('Current User aktif:', this.currentUser);
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          if (!this.isInit) {
            this.initializeMap();
            this.isInit = true;
            this.startTimer();
          } else {
            this.moving();
          }
        },
        (error) => {
          console.error('Error getting location', error);
          // Fallback koordinat jika browser/HP memblokir GPS (default ke titik pusat ibadah)
          if (!this.isInit && this.tempat?.lat) {
            this.lat = this.tempat.lat;
            this.lon = this.tempat.lon;
            this.initializeMap();
            this.isInit = true;
            this.startTimer();
          }
        }
      );
    }
  }

  initializeMap() {
    if (this.map) {
      this.map.remove();
    }

    const defaultLat = this.tempat.lat || this.lat || 21.3891;
    const defaultLon = this.tempat.lon || this.lon || 39.8579;

    this.map = L.map('map', { zoomControl: false }).setView([defaultLat, defaultLon], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    const markerIcon = L.icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });

    const markerIconCenter = L.icon({
      iconUrl: 'https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color/254000/66-512.png',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    const markerIconCorner = L.icon({
      iconUrl: 'https://static.thenounproject.com/png/335079-200.png',
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });

    // Marker User & Marker Pusat Lokasi
    this.markerUser = L.marker([this.lat, this.lon], { icon: markerIcon }).addTo(this.map);
    if (this.tempat.lat && this.tempat.lon) {
      this.markerLokasi = L.marker([this.tempat.lat, this.tempat.lon], { icon: markerIconCenter }).addTo(this.map);
    }

    // 4 Sudut Rute Putaran
    if (this.tempat.rute1) this.rute1 = L.marker([this.tempat.rute1.lat, this.tempat.rute1.lon], { icon: markerIconCorner }).addTo(this.map);
    if (this.tempat.rute2) this.rute2 = L.marker([this.tempat.rute2.lat, this.tempat.rute2.lon], { icon: markerIconCorner }).addTo(this.map);
    if (this.tempat.rute3) this.rute3 = L.marker([this.tempat.rute3.lat, this.tempat.rute3.lon], { icon: markerIconCorner }).addTo(this.map);
    if (this.tempat.rute4) this.rute4 = L.marker([this.tempat.rute4.lat, this.tempat.rute4.lon], { icon: markerIconCorner }).addTo(this.map);
  }

  startTimer() {
    this.timerSubscription = interval(1500).subscribe(() => {
      this.getCoordinates();
      this.count += 1;
      this.checkRuteTerdekat();
    });
  }

  checkRuteTerdekat() {
    if (!this.tempat.rute1) return;

    const toleransi = 0.0003; // Radius toleransi presisi GPS
    const rutes = [this.tempat.rute1, this.tempat.rute2, this.tempat.rute3, this.tempat.rute4];

    for (let i = 0; i < rutes.length; i++) {
      const rute = rutes[i];
      if (!rute) continue;

      const dekatLat = Math.abs(this.lat - rute.lat) <= toleransi;
      const dekatLon = Math.abs(this.lon - rute.lon) <= toleransi;

      if (dekatLat && dekatLon) {
        const nomorRute = i + 1;
        const lastVisited = this.urutanKunjungan[this.urutanKunjungan.length - 1];

        if (lastVisited !== nomorRute) {
          this.urutanKunjungan.push(nomorRute);
          this.gambarJalur();

          const target = [1, 2, 3, 4, 1];
          if (this.urutanKunjungan.length >= 5) {
            const lastFive = this.urutanKunjungan.slice(-5);
            if (JSON.stringify(lastFive) === JSON.stringify(target)) {
              this.putaran += 1;
              this.urutanKunjungan = [];
              this.gambarJalur();

              if (this.putaran >= 7) {
                this.selesaiRute();
              }
            }
          }
        }
      }
    }
  }

  gambarJalur() {
    if (this.jalurPolyline) {
      this.map.removeLayer(this.jalurPolyline);
    }

    const ruteMap: any = {
      1: this.tempat.rute1,
      2: this.tempat.rute2,
      3: this.tempat.rute3,
      4: this.tempat.rute4,
    };

    const jalur: [number, number][] = this.urutanKunjungan
      .filter((r) => ruteMap[r])
      .map((r) => [ruteMap[r].lat, ruteMap[r].lon]);

    if (jalur.length > 0) {
      this.jalurPolyline = L.polyline(jalur, {
        color: '#0b4635',
        weight: 4,
        opacity: 0.8,
      }).addTo(this.map);
    }
  }

  getNextTarget(): number {
    const last = this.urutanKunjungan[this.urutanKunjungan.length - 1];
    if (!last || last === 4) return 1;
    return last + 1;
  }

  moving() {
    if (this.markerUser) {
      this.markerUser.setLatLng([this.lat, this.lon]);
    }
  }

  // Bypass step rute untuk pengujian
  jalan() {
    this.pos += 1;
    if (this.pos === 1 && this.tempat.rute1) {
      this.lat = this.tempat.rute1.lat;
      this.lon = this.tempat.rute1.lon;
    } else if (this.pos === 2 && this.tempat.rute2) {
      this.lat = this.tempat.rute2.lat;
      this.lon = this.tempat.rute2.lon;
    } else if (this.pos === 3 && this.tempat.rute3) {
      this.lat = this.tempat.rute3.lat;
      this.lon = this.tempat.rute3.lon;
    } else if (this.pos === 4 && this.tempat.rute4) {
      this.lat = this.tempat.rute4.lat;
      this.lon = this.tempat.rute4.lon;
    } else if (this.pos === 5 && this.tempat.rute1) {
      this.lat = this.tempat.rute1.lat;
      this.lon = this.tempat.rute1.lon;
      this.pos = 0;
    }
    this.moving();
    this.checkRuteTerdekat();
  }

  async konfirmasiReset() {
    const alert = await this.alertCtrl.create({
      header: 'Reset Putaran',
      message: 'Apakah Anda yakin ingin mengulang putaran dari awal?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Ya, Reset',
          role: 'destructive',
          handler: () => {
            this.putaran = 0;
            this.urutanKunjungan = [];
            this.gambarJalur();
          },
        },
      ],
    });
    await alert.present();
  }

  async selesaiRute() {
    // 1. Kirim update ke database server jika ada akun user login
    if (this.currentUser?.id && this.tempat?.id !== undefined) {
      try {
        await firstValueFrom(
          this.tempatService.completeUserActivity(
            this.currentUser.id,
            this.tempat.id,
            'selesai',
            this.lat,
            this.lon
          )
        );
        console.log('Status ibadah berhasil disimpan ke database');
      } catch (err) {
        console.error('Gagal mencatat riwayat ke server:', err);
      }
    }

    // 2. Beri pesan sukses dan arahkan kembali
    const alert = await this.alertCtrl.create({
      header: 'Alhamdulillah!',
      subHeader: this.tempat.nama || this.tempat.name,
      message: 'Rangkaian rute ibadah ini telah tercatat selesai.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Kembali ke Rangkaian',
          handler: () => {
            this.navCtrl.back();
          }
        }
      ],
    });
    await alert.present();
  }

  ionViewWillLeave() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}