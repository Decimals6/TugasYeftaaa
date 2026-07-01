import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-jamaah',
  templateUrl: './detail-jamaah.page.html',
  styleUrls: ['./detail-jamaah.page.scss'],
  standalone: false
})
export class DetailJamaahPage implements OnInit {

  id: number = 1;

  daftarJamaah = [

    {
      id: 1,
      kode: 'JMH-001',
      nama: 'Ahmad Fauzi',
      umur: 58,
      jenisKelamin: 'Laki-laki',
      kloter: '01',
      asal: 'Surabaya',
      lokasi: 'Masjidil Haram',
      latitude: -21.4225,
      longitude: 39.8262,
      status: 'Online',
      gps: 'Aktif',
      baterai: 92,
      update: '1 menit lalu',
      sos: 'Tidak Ada',
      pembimbing: 'Ust. Abdullah',
      telepon: '081234567890',
      foto: 'https://i.pravatar.cc/300?img=10'
    },

    {
      id: 2,
      kode: 'JMH-002',
      nama: 'Siti Aminah',
      umur: 54,
      jenisKelamin: 'Perempuan',
      kloter: '01',
      asal: 'Bandung',
      lokasi: 'Mina',
      latitude: -21.4130,
      longitude: 39.8930,
      status: 'Istirahat',
      gps: 'Aktif',
      baterai: 78,
      update: '5 menit lalu',
      sos: 'Tidak Ada',
      pembimbing: 'Ust. Abdullah',
      telepon: '081298765432',
      foto: 'https://i.pravatar.cc/300?img=11'
    },

    {
      id: 3,
      kode: 'JMH-003',
      nama: 'Nur Hidayah',
      umur: 61,
      jenisKelamin: 'Perempuan',
      kloter: '02',
      asal: 'Yogyakarta',
      lokasi: 'Arafah',
      latitude: -21.3550,
      longitude: 39.9840,
      status: 'Offline',
      gps: 'Tidak Aktif',
      baterai: 15,
      update: '20 menit lalu',
      sos: 'Tidak Ada',
      pembimbing: 'Ust. Rahman',
      telepon: '081277777777',
      foto: 'https://i.pravatar.cc/300?img=12'
    },

    {
      id: 4,
      kode: 'JMH-004',
      nama: 'Muhammad Yusuf',
      umur: 63,
      jenisKelamin: 'Laki-laki',
      kloter: '03',
      asal: 'Semarang',
      lokasi: 'Muzdalifah',
      latitude: -21.3890,
      longitude: 39.9160,
      status: 'Online',
      gps: 'Aktif',
      baterai: 100,
      update: 'Baru saja',
      sos: 'Tidak Ada',
      pembimbing: 'Ust. Hasan',
      telepon: '081266666666',
      foto: 'https://i.pravatar.cc/300?img=13'
    },

    {
      id: 5,
      kode: 'JMH-005',
      nama: 'Fatimah Zahra',
      umur: 57,
      jenisKelamin: 'Perempuan',
      kloter: '04',
      asal: 'Jakarta',
      lokasi: 'Mina',
      latitude: -21.4145,
      longitude: 39.8940,
      status: 'SOS',
      gps: 'Aktif',
      baterai: 81,
      update: '30 detik lalu',
      sos: 'Tombol Darurat Ditekan',
      pembimbing: 'Ust. Ridwan',
      telepon: '081255555555',
      foto: 'https://i.pravatar.cc/300?img=14'
    }

  ];

  jamaah: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.jamaah = this.daftarJamaah.find(
      item => item.id === this.id
    );

  }

}