import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { interval, Subscription, firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TempatserviceService } from '../tempatservice.service';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-minadetail',
  templateUrl: './minadetail.page.html',
  styleUrls: ['./minadetail.page.scss'],
  standalone: false,
})
export class MinadetailPage implements OnInit {
  lat: number = 0;
  lon: number = 0;
  map: any;
  markerLokasi: any;
  markerUser: any;
  timerSubscription: Subscription | undefined;
  isInit = false;

  id: number = 0;
  tempat: any = null;
  currentUser: any = null;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private tempatService: TempatserviceService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.loadUserData();

    this.route.params.subscribe(async params => {
      this.id = +(params['index'] || params['id'] || 0);

      // Ambil data dari master initData API
      const data = await this.tempatService.initData();

      // Cari lokasi Mina terlebih dahulu
      const minaLoc = data.find((t: any) =>
        (t.name || t.nama || '').toLowerCase().includes('mina')
      );

      // Cari activity berdasarkan ID database (misal ID: 3, 4, 5)
      if (minaLoc?.list) {
        this.tempat = minaLoc.list.find((item: any) => item.id === this.id);
      }

      // Fallback cadangan jika data belum masuk tree
      if (!this.tempat) {
        this.tempat = this.tempatService.getMinaById(this.id) || {};
      }

      console.log('Pos Jumrah Terpilih:', this.tempat);
      this.getCoordinates();
    });
  }

  loadUserData() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      const raw = localStorage.getItem('user_session');
      if (raw) {
        this.currentUser = JSON.parse(raw);
      }
    }
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

    const defaultLat = this.tempat?.lat || this.lat || 21.4231;
    const defaultLon = this.tempat?.lon || this.lon || 39.8943;

    this.map = L.map('map', { zoomControl: false }).setView([defaultLat, defaultLon], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    const userIcon = L.icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });

    const jumrahIcon = L.icon({
      iconUrl: 'https://static.thenounproject.com/png/335079-200.png',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    this.markerUser = L.marker([this.lat, this.lon], { icon: userIcon }).addTo(this.map);

    if (this.tempat?.lat && this.tempat?.lon) {
      this.markerLokasi = L.marker([this.tempat.lat, this.tempat.lon], { icon: jumrahIcon }).addTo(this.map);
    }
  }

  startTimer() {
    this.timerSubscription = interval(1500).subscribe(() => {
      this.getCoordinates();
      this.checkRuteTerdekat();
    });
  }

  checkRuteTerdekat() {
    if (!this.tempat?.lat || !this.tempat?.lon) return;

    const toleransi = 0.0003;
    const dekatLat = Math.abs(this.lat - this.tempat.lat) <= toleransi;
    const dekatLon = Math.abs(this.lon - this.tempat.lon) <= toleransi;

    if (dekatLat && dekatLon) {
      this.selesaiRute();
    }
  }

  moving() {
    if (this.markerUser) {
      this.markerUser.setLatLng([this.lat, this.lon]);
    }
    if (this.markerLokasi && this.tempat?.lat && this.tempat?.lon) {
      this.markerLokasi.setLatLng([this.tempat.lat, this.tempat.lon]);
    }
  }

  simulasiTiba() {
    if (this.tempat?.lat && this.tempat?.lon) {
      this.lat = this.tempat.lat;
      this.lon = this.tempat.lon;
      this.moving();
      this.selesaiRute();
    }
  }

  async lihatPanduan() {
    const alert = await this.alertCtrl.create({
      header: 'Panduan Lontar',
      subHeader: this.tempat?.nama || this.tempat?.name,
      message: this.tempat?.keterangan || this.tempat?.description || 'Lontarkan 7 batu kerikil satu per satu dengan membaca takbir.',
      buttons: ['Mengerti'],
    });
    await alert.present();
  }

  async selesaiRute() {
    this.stopTimer();

    const userId = this.currentUser?.id;
    const activityId = this.tempat?.id || this.id;

    if (userId && activityId) {
      try {
        await firstValueFrom(
          this.tempatService.completeUserActivity(
            userId,
            activityId,
            'selesai',
            this.lat,
            this.lon
          )
        );
        console.log('Status lempar jumrah tercatat ke server');
      } catch (err) {
        console.error('Gagal mencatat jumrah ke server:', err);
      }
    }

    const alert = await this.alertCtrl.create({
      header: 'Alhamdulillah!',
      subHeader: this.tempat?.nama || this.tempat?.name || 'Jumrah Selesai',
      message: 'Lontaran batu kerikil pada pilar ini telah tercatat selesai.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Kembali ke Pos Mina',
          handler: () => {
            this.navCtrl.back();
          }
        }
      ],
    });
    await alert.present();
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ionViewWillLeave() {
    this.stopTimer();
  }
}