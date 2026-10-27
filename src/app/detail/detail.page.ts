import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { interval, Subscription, firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TempatserviceService } from '../tempatservice.service';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false
})
export class DetailPage implements OnInit {
  lat: number = 0;
  lon: number = 0;
  map: any;
  markerLokasi: any;
  markerUser: any;
  timerSubscription: Subscription | undefined;
  isInit = false;

  id: number = 0;
  tempat: any = {};
  currentUser: any = null;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private authService: AuthService,
    private tempatService: TempatserviceService
  ) { }

  async ngOnInit() {
    this.loadUserData();

    this.route.params.subscribe(async params => {
      this.id = +(params['index'] || params['id'] || 0);

      const data = await this.tempatService.initData();
      this.tempat = data.find((t: any) => t.id === this.id) || this.tempatService.getTempatById(this.id) || {};

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

    const defaultLat = this.tempat?.lat || this.lat || 21.3542;
    const defaultLon = this.tempat?.lon || this.lon || 39.9836;

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

    const destinationIcon = L.icon({
      iconUrl: 'https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color/254000/66-512.png',
      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });

    this.markerUser = L.marker([this.lat, this.lon], { icon: userIcon }).addTo(this.map);

    if (this.tempat?.lat && this.tempat?.lon) {
      this.markerLokasi = L.marker([this.tempat.lat, this.tempat.lon], { icon: destinationIcon }).addTo(this.map);
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

  // Bypass langsung posisikan user di titik koordinat tujuan
  simulasiTiba() {
    if (this.tempat?.lat && this.tempat?.lon) {
      this.lat = this.tempat.lat;
      this.lon = this.tempat.lon;
      this.moving();
      this.selesaiRute();
    }
  }

  async lihatInfo() {
    const alert = await this.alertCtrl.create({
      header: 'Panduan Kegiatan',
      subHeader: this.tempat.nama || this.tempat.name,
      message: this.tempat.detail || this.tempat.keterangan || this.tempat.description || 'Tidak ada keterangan tambahan.',
      buttons: ['Mengerti'],
    });
    await alert.present();
  }

  async selesaiRute() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

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
        console.log('Status ibadah berhasil disinkronkan ke tabel user_activities');
      } catch (err) {
        console.error('Gagal mencatat riwayat ke server:', err);
      }
    }

    const alert = await this.alertCtrl.create({
      header: 'Alhamdulillah!',
      subHeader: this.tempat.nama || this.tempat.name,
      message: 'Tahapan ibadah di lokasi ini telah selesai dilaksanakan.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Kembali ke Rangkaian',
          handler: () => {
            this.navCtrl.navigateRoot('/home');
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