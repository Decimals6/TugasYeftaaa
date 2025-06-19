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
  markerUser: any;
  timerSubscription: Subscription | undefined;
  isInit = false;
  lat2 = 0.0;
  lon2 = 0.0;

  // count = 0;
  // markerTeman: any;
  // rute1: any;
  // rute2: any;
  // rute3: any;
  // rute4: any;
  // putaran = 0;

  // fullname = "";
  // teman = "";

  id: number = 0;
  tempat: any = {};

  // urutanKunjungan: number[] = []; // 🆕 Menyimpan urutan kunjungan titik
  // jalurPolyline: any = null;      // 🆕 Untuk menggambar garis jalur

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private tempatService: TempatserviceService
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['index'];
    });
    await this.tempatService.loadStatusFromStorage();
    this.tempat = this.tempatService.tempatList[this.id];
    this.getCoordinates();
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


    this.markerUser = L.marker([this.lat, this.lon], { icon: markerIcon }).addTo(this.map);
    this.markerLokasi = L.marker([this.lat2, this.lon2], { icon: markerIcon2 }).addTo(this.map);
  }

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.getCoordinates();
      // this.count += 1;
      this.checkRuteTerdekat();
    });
  }

  checkRuteTerdekat() {
    const toleransi = 0.0001;
    const dekatLat = Math.abs(this.lat - this.tempat.lat) <= toleransi;
    const dekatLon = Math.abs(this.lon - this.tempat.lon) <= toleransi;

    if (dekatLat && dekatLon) {
      this.selesaiRute();
    }
  }
  async lihatInfo() {
    const alert = await this.alertCtrl.create({
        header: 'Detail Kegiatan',
        message: this.tempat.detail,
        buttons: ['OK'],
      });
      await alert.present();
  }

  ionViewWillLeave() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log("Timer stopped");
    }
  }

  // async konfirmasiReset() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Konfirmasi',
  //     message: 'Apakah kamu yakin ingin mereset jumlah putaran?',
  //     buttons: [
  //       {
  //         text: 'Batal',
  //         role: 'cancel',
  //       },
  //       {
  //         text: 'Ya, Reset',
  //         handler: () => {
  //           this.putaran = 0;
  //           this.urutanKunjungan = [];
  //           this.gambarJalur(); // 🆕 reset polyline
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }

  moving() {
    this.markerUser.setLatLng([this.lat, this.lon]);
    this.markerLokasi.setLatLng([this.tempat.lat, this.tempat.lon]);
    // Anda bisa menambahkan komunikasi server jika diperlukan
  }

  async selesaiRute() {
    const nextId = this.id + 1;
    if (nextId < this.tempatService.getTempat().length) {
      this.tempatService.updateStatusTempat(nextId, true);
      const alert = await this.alertCtrl.create({
        header: 'Selesai!',
        message: 'Lanjutkan ke ' + this.tempatService.getTempat()[nextId].nama,
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Selesai!',
        message: 'Semua tempat sudah berhasil diselesaikan 🎉',
        buttons: ['OK'],
      });
      await alert.present();
    }

  }

}
