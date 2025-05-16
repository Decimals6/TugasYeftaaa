import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TempatserviceService } from '../tempatservice.service';
import { AlertController } from '@ionic/angular';

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
  timerSubscription: Subscription | undefined;
  isInit = false;
  count = 0;
  markerTeman: any;
  rute1: any;
  rute2: any;
  rute3: any;
  rute4: any;
  putaran = 0;
  lat2 = 0.0;
  lon2 = 0.0;
  fullname = '';
  teman = '';
  id: number = 0;
  tempat: any = {};

  // Untuk menyimpan urutan rute yang telah dilalui
  urutanRute: number[] = [];

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private tempatService: TempatserviceService
  ) {}

  ngOnInit() {
    this.fullname = localStorage.getItem('app_fullname') ?? '';
    this.route.params.subscribe(params => {
      this.id = params['index'];
    });
    this.tempat = this.tempatService.tempatList[this.id];
    this.getCoordinates();
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
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
        error => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported in this browser.');
    }
  }

  initializeMap() {
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map('map').setView([this.lat, this.lon], 13);
    const googleStreets = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
    );
    googleStreets.addTo(this.map);

    const markerIcon = L.icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    });
    const markerIcon2 = L.icon({
      iconUrl: 'https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color/254000/66-512.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    });
    const markerIcon3 = L.icon({
      iconUrl: 'https://static.thenounproject.com/png/335079-200.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    });

    this.markerLokasi = L.marker([this.lat, this.lon], { icon: markerIcon }).addTo(this.map);
    this.markerTeman = L.marker([this.lat2, this.lon2], { icon: markerIcon2 }).addTo(this.map);
    this.rute1 = L.marker([this.tempat.rute1.lat, this.tempat.rute1.lon], { icon: markerIcon3 }).addTo(this.map);
    this.rute2 = L.marker([this.tempat.rute2.lat, this.tempat.rute2.lon], { icon: markerIcon3 }).addTo(this.map);
    this.rute3 = L.marker([this.tempat.rute3.lat, this.tempat.rute3.lon], { icon: markerIcon3 }).addTo(this.map);
    this.rute4 = L.marker([this.tempat.rute4.lat, this.tempat.rute4.lon], { icon: markerIcon3 }).addTo(this.map);
  }

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.getCoordinates();
      this.count += 1;
      this.checkRuteTerdekat();
    });
  }

  checkRuteTerdekat() {
    const toleransi = 0.0001;

    const ruteMap: { [key: number]: { lat: number; lon: number } } = {
      1: this.tempat.rute1,
      2: this.tempat.rute2,
      3: this.tempat.rute3,
      4: this.tempat.rute4,
    };

    for (let r = 1; r <= 4; r++) {
      const titik = ruteMap[r];
      const dekatLat = Math.abs(this.lat - titik.lat) <= toleransi;
      const dekatLon = Math.abs(this.lon - titik.lon) <= toleransi;

      if (dekatLat && dekatLon) {
        if (!this.urutanRute.includes(r)) {
          this.urutanRute.push(r);
          alert(`Kamu telah melewati rute ${r}`);
        }

        // Cek apakah putaran selesai
        if (this.urutanRute.length === 4 && this.urutanRute[0] === r) {
          this.putaran += 1;
          alert(`Selamat! Kamu telah menyelesaikan ${this.putaran} putaran.`);
          this.urutanRute = [];
        }

        break; // Supaya tidak mendeteksi lebih dari satu titik dalam satu kali deteksi
      }
    }
  }

  moving() {
    this.markerLokasi.setLatLng([this.lat, this.lon]);
    this.markerTeman.setLatLng([this.tempat.lat, this.tempat.lon]);
  }

  ionViewWillLeave() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log('Timer stopped');
    }
  }

  async konfirmasiReset() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Apakah kamu yakin ingin mereset jumlah putaran?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Ya, Reset',
          handler: () => {
            this.putaran = 0;
            this.urutanRute = [];
          },
        },
      ],
    });

    await alert.present();
  }
}
