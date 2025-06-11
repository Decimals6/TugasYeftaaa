import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TempatserviceService } from '../tempatservice.service';
import { AlertController } from '@ionic/angular';
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

  lat2 = 0.0;
  lon2 = 0.0;


  id: number = 0;
  tempat: any = {};


  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private tempatService: TempatserviceService
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['index'];
    });
    await this.tempatService.loadMinaStatusFromStorage();
    this.tempat = this.tempatService.minaList[this.id];
    this.getCoordinates();
    console.log(this.tempat.lat, this.tempat.lon);
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
    this.markerLokasi = L.marker([this.tempat.lat, this.tempat.lon], { icon: markerIcon2 }).addTo(this.map);
  }

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.getCoordinates();
      this.checkRuteTerdekat();
    });
  }

  checkRuteTerdekat() {
    const toleransi = 0.0001;
    const dekatLat = Math.abs(this.lat - this.tempat.lat) <= toleransi;
    const dekatLon = Math.abs(this.lon - this.tempat.lon) <= toleransi;

    if (dekatLat && dekatLon) {
      this.selesaiRute()
    }
  }

  ionViewWillLeave() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log("Timer stopped");
    }
  }

  moving() {
    this.markerUser.setLatLng([this.lat, this.lon]);
    this.markerLokasi.setLatLng([this.tempat.lat, this.tempat.lon]);
    // Anda bisa menambahkan komunikasi server jika diperlukan
  }

  async selesaiRute() {
    const nextId = this.id + 1;
    if (nextId < this.tempatService.getMina().length) {
      this.tempatService.updateMinaStatusTempat(nextId, true);
      const alert = await this.alertCtrl.create({
        header: 'Selesai!',
        message: 'Lanjutkan ke tempat berikutnya',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.tempatService.updateStatusTempat(4, true);
      const alert = await this.alertCtrl.create({
        header: 'Selesai!',
        message: 'Ibadah Jumrah (melempar batu) telah selesai, lanjutkan ke makkah akhir',
        buttons: ['OK'],
      });
      await alert.present();
    }

  }

}
