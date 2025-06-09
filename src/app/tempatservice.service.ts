import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempatserviceService {

  constructor() { }

  tempatList = [
    {
      id: 0,
      nama: 'Makkah Awal',
      keterangan: 'Persiapan Ihram dan Umrah',
      url: '',
      lat: 21.3891,
      lon: 39.8579,
      rute1: { lat: 21.3901, lon: 39.8585 },
      rute2: { lat: 21.3880, lon: 39.8570 },
      rute3: { lat: 21.3875, lon: 39.8590 },
      rute4: { lat: 21.3895, lon: 39.8565 },
    },
    {
      id: 1,
      nama: 'Arafah',
      keterangan: 'Wukuf di Padang Arafah',
      url: '',
      lat: 21.3542,
      lon: 39.9836,
      rute1: { lat: 21.3550, lon: 39.9840 },
      rute2: { lat: 21.3535, lon: 39.9820 },
      rute3: { lat: 21.3548, lon: 39.9830 },
      rute4: { lat: 21.3530, lon: 39.9845 },
    },
    {
      id: 2,
      nama: 'Muzdalifah',
      keterangan: 'Menginap dan Mengumpulkan Batu',
      url: '',
      lat: 21.3628,
      lon: 39.9406,
      rute1: { lat: 21.3630, lon: 39.9410 },
      rute2: { lat: 21.3620, lon: 39.9400 },
      rute3: { lat: 21.3615, lon: 39.9412 },
      rute4: { lat: 21.3635, lon: 39.9398 },
    },
    {
      id: 3,
      nama: 'Mina',
      keterangan: 'Melempar Jumrah dan Mabit',
      url: '',
      lat: 21.4231,
      lon: 39.8943,
      rute1: { lat: 21.4240, lon: 39.8950 },
      rute2: { lat: 21.4225, lon: 39.8935 },
      rute3: { lat: 21.4235, lon: 39.8948 },
      rute4: { lat: 21.4218, lon: 39.8930 },
    },
    {
      id: 4,
      nama: 'Makkah Akhir',
      keterangan: 'Tawaf Ifadah dan Sai',
      url: '',
      lat: 21.3891,
      lon: 39.8579,
      rute1: { lat: 21.3905, lon: 39.8588 },
      rute2: { lat: 21.3883, lon: 39.8574 },
      rute3: { lat: 21.3890, lon: 39.8593 },
      rute4: { lat: 21.3878, lon: 39.8568 },
    }
  ];

  getTempatById(id: number) {
    return this.tempatList.find(t => t.id === id);
  }

  getTempat() {
    return this.tempatList;
  }
}
