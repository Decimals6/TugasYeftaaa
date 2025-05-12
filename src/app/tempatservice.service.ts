import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempatserviceService {

  constructor() { }

  tempatList = [
    {
      id: 0,
      nama: 'Masjid Agung',
      url: 'https://tourism.surabaya.go.id/api/helper/show-file/tourist-destination-files/9a4d3a9d-b50c-4cc0-a6c0-700169ff14f4',
      lat: -7.336421426011507,
      lon: 112.71502445028709,
      keterangan: 'Masjid Terbesar di surabaya',
      rute1: {lat: -7.337021174019103, lon: 112.71527708730196},
      rute2: {lat: -7.336691940765349, lon: 112.71440023535747},
      rute3: {lat: -7.335710451506833, lon: 112.71500150526226},
      rute4: {lat: -7.336176348576652, lon: 112.71595351594482},
    },
    {
      id: 1,
      nama: 'Masjid Cheng Hoo',
      url: 'https://pict.sindonews.net/dyn/850/pena/news/2021/04/18/29/401056/masjid-cheng-ho-seperti-pagoda-dan-filosofi-kakbah-serta-perjalanan-wali-songo-qeu.jpg',
      lat: -7.2520902102060285, 
      lon: 112.74694642808848,
      keterangan: 'Masjid dengan kultural cina',
      rute1: {lat: -7.2517748963109305, lon: 112.74684652238757},
      rute2: {lat: -7.251822048227448, lon: 112.7472669988793},
      rute3: {lat: -7.252427768562005, lon: 112.74708052669601},
      rute4: {lat: -7.2522645505879995, lon: 112.74662714334839},
    },
    {
      id: 2,
      nama: 'Masjid Al-Mukhlisin',
      url: 'https://plongsite.wordpress.com/wp-content/uploads/2018/04/img_20180420_111649216652334.jpg',
      lat: -7.3136057473826765, 
      lon: 112.66720833744299,
      keterangan: 'Masjid didalam perumahan',
      rute1: {lat: -7.313650518893065, lon: 112.66707184645891},
      rute2: {lat: -7.313380548298757, lon: 112.66712258869184},
      rute3: {lat: -7.3135330091604205, lon: 112.6680275723617},
      rute4: {lat: -7.3138139339285395, lon: 112.66796256896303},
    },
    {
      id: 3,
      nama: 'Masjid At-Taqwa',
      url: 'https://www.griyababatanmukti.com/app/uploads/sites/155/2020/12/Masjid.jpg',
      lat: -7.313778, 
      lon: 112.676944,
      keterangan: 'Masjid didalam perumahan',
      rute1: { lat: -7.313750, lon: 112.677250 },
      rute2: { lat: -7.313694, lon: 112.676972 },
      rute3: { lat: -7.313889, lon: 112.676750 },
      rute4: { lat: -7.314278, lon: 112.676889 }
,
    },
    
  ]

  getTempatById(id: number) {
    return this.tempatList.find(t => t.id === id);
  }

  getTempat() {
    return this.tempatList;
  }
}
