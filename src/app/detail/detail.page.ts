import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TempatserviceService } from '../tempatservice.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false
})
export class DetailPage implements OnInit {
  lat: number = 0
  lon: number = 0
  map: any;
  markerLokasi: any;
  timerSubscription: Subscription | undefined;
  isInit = false
  markerTeman: any;
  rute1: any;
  rute2: any;
  rute3: any;
  rute4: any;
  ruteTerlalui = [false, false, false, false];
  putaran = 0;
  lat2 = 0.0
  lon2 = 0.0
  fullname = ""
  teman = ""

  id: number = 0;
  tempat: any = {};


  constructor(private route: ActivatedRoute, private tempatService: TempatserviceService) { }

  ngOnInit() {
    this.fullname = localStorage.getItem("app_fullname") ?? "";
    this.route.params.subscribe(params => {
      this.id = params['index'];
    });
    this.tempat = this.tempatService.tempatList[this.id]
    console.log(this.id);
    console.log(this.tempat)
    this.getCoordinates()
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        if (!this.isInit) {
          this.initializeMap()
          this.isInit = true
          this.startTimer()
        }
        else {
          this.moving()
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
      this.map.remove(); // hapus map lama kalau sudah ada
    }
    // Create a map centered at a specific location 
    this.map = L.map('map').setView([this.lat, this.lon], 13);
    // Add a gmap street tile layer (you may use other providers, like bing OpenStreetMap, mapbox, etc.. )
    const googleStreets = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
    );
    ;

    googleStreets.addTo(this.map)
    var markerIcon = L.icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', iconSize: [50, 50],
      iconAnchor: [25, 50],

    });
    var markerIcon2 = L.icon({
      iconUrl: 'https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color/254000/66-512.png', iconSize: [50, 50],
      iconAnchor: [25, 50],

    });
    var markerIcon3 = L.icon({
      iconUrl: 'https://static.thenounproject.com/png/335079-200.png', iconSize: [50, 50],
      iconAnchor: [25, 50],

    });
    this.markerLokasi = L.marker([this.lat, this.lon], { icon: markerIcon })
    this.markerLokasi.addTo(this.map)
    this.markerTeman = L.marker([this.lat2, this.lon2], { icon: markerIcon2 })
    this.markerTeman.addTo(this.map);
    this.rute1 = L.marker([this.tempat.rute1.lat, this.tempat.rute1.lon], { icon: markerIcon3 })
    this.rute1.addTo(this.map);
    this.rute2 = L.marker([this.tempat.rute2.lat, this.tempat.rute2.lon], { icon: markerIcon3 })
    this.rute2.addTo(this.map);
    this.rute3 = L.marker([this.tempat.rute3.lat, this.tempat.rute3.lon], { icon: markerIcon3 })
    this.rute3.addTo(this.map);
    this.rute4 = L.marker([this.tempat.rute4.lat, this.tempat.rute4.lon], { icon: markerIcon3 })
    this.rute4.addTo(this.map);
  }
  startTimer() {
    this.timerSubscription = interval(3000).subscribe(() => {
      this.getCoordinates()
    });
  }
  checkRuteTerdekat() {
    const toleransi = 0.0005;
    const rutes = [this.tempat.rute1, this.tempat.rute2, this.tempat.rute3, this.tempat.rute4];

    for (let i = 0; i < rutes.length; i++) {
      const rute = rutes[i];

      const dekatLat = Math.abs(this.lat - rute.lat) <= toleransi;
      const dekatLon = Math.abs(this.lon - rute.lon) <= toleransi;

      if (dekatLat && dekatLon && !this.ruteTerlalui[i]) {
        this.ruteTerlalui[i] = true;
        alert(`Kamu telah melewati rute ${i + 1}`);
      }
    }

    // Cek apakah semua rute sudah dilalui
    if (this.ruteTerlalui.every(status => status)) {
      this.putaran += 1;
      alert(`Kamu telah berputar ${this.putaran}x!`);
      this.ruteTerlalui = [false, false, false, false]; // reset buat putaran berikutnya
    }
  }

  moving() {
    this.markerLokasi.setLatLng([this.lat, this.lon])
    this.markerTeman.setLatLng([this.tempat.lat, this.tempat.lon])
    // this.foodservice.setPos(this.lat.toString(), this.lon.toString(), this.fullname).subscribe({
    //   next: (response) => {
    //     console.log('Success:', response);

    //   },
    //   error: (err) => {
    //     console.error('Error:', err);

    //   },
    // });
    // // this.map.flyTo([this.lat, this.lon],13); 
    // this.foodservice.getPos(this.teman).subscribe((data) => {
    //   this.markerTeman.setLatLng([data.x, data.y])
    //   console.log(data.x +"and"+ data.y)
    // }
    // );
  }




}
