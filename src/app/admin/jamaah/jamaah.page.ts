import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jamaah',
  templateUrl: './jamaah.page.html',
  styleUrls: ['./jamaah.page.scss'],
  standalone: false
})
export class JamaahPage implements OnInit {

  constructor() { }

  // Ringkasan Dashboard
  totalJamaah = 120;
  online = 117;
  offline = 2;
  sos = 1;

  // Data Dummy Jamaah
  jamaah = [

    {
      id: 'JMH-001',
      nama: 'Ahmad Fauzi',
      kloter: 'Kloter 01',
      lokasi: 'Makkah',
      status: 'Online',
      battery: '92%',
      update: '1 Menit lalu',
      avatar: 'https://i.pravatar.cc/150?img=10'
    },

    {
      id: 'JMH-002',
      nama: 'Siti Aminah',
      kloter: 'Kloter 01',
      lokasi: 'Mina',
      status: 'Istirahat',
      battery: '78%',
      update: '5 Menit lalu',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },

    {
      id: 'JMH-003',
      nama: 'Nur Hidayah',
      kloter: 'Kloter 02',
      lokasi: 'Arafah',
      status: 'Offline',
      battery: '0%',
      update: '20 Menit lalu',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },

    {
      id: 'JMH-004',
      nama: 'Muhammad Yusuf',
      kloter: 'Kloter 03',
      lokasi: 'Muzdalifah',
      status: 'Online',
      battery: '100%',
      update: 'Baru saja',
      avatar: 'https://i.pravatar.cc/150?img=13'
    },

    {
      id: 'JMH-005',
      nama: 'Fatimah Zahra',
      kloter: 'Kloter 04',
      lokasi: 'Mina',
      status: 'SOS',
      battery: '40%',
      update: 'Sekarang',
      avatar: 'https://i.pravatar.cc/150?img=14'
    }

  ];

  ngOnInit() {

  }

}