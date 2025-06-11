import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TempatserviceService {

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  tempatList = [
    {
      id: 0,
      nama: 'Makkah Awal',
      keterangan: 'Persiapan Ihram dan Umrah',
      url: 'https://pkbtalk24.com/wp-content/uploads/2025/04/msuim-haji-2025-Saudi-mulai-batasi-jamaah-umrah-masuk-mekah.jpg',
      lat: 21.3891,
      lon: 39.8579,
      rute1: { lat: 21.3901, lon: 39.8585 },
      rute2: { lat: 21.3880, lon: 39.8570 },
      rute3: { lat: 21.3875, lon: 39.8590 },
      rute4: { lat: 21.3895, lon: 39.8565 },
      status: true,
    },
    {
      id: 1,
      nama: 'Arafah',
      keterangan: 'Wukuf di Padang Arafah',
      url: 'https://cdn0-production-images-kly.akamaized.net/yhNo-3lll2XxY264wcc00ojr4XI=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3420246/original/026155800_1617619011-jabal-arafat_21730-5765.jpg',
      lat: 21.3542,
      lon: 39.9836,
      rute1: { lat: 21.3550, lon: 39.9840 },
      rute2: { lat: 21.3535, lon: 39.9820 },
      rute3: { lat: 21.3548, lon: 39.9830 },
      rute4: { lat: 21.3530, lon: 39.9845 },
      status: false,
    },
    {
      id: 2,
      nama: 'Muzdalifah',
      keterangan: 'Menginap dan Mengumpulkan Batu',
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Mabit_in_Muzdalifah.JPG',
      lat: 21.3628,
      lon: 39.9406,
      rute1: { lat: 21.3630, lon: 39.9410 },
      rute2: { lat: 21.3620, lon: 39.9400 },
      rute3: { lat: 21.3615, lon: 39.9412 },
      rute4: { lat: 21.3635, lon: 39.9398 },
      status: false,
    },
    {
      id: 3,
      nama: 'Mina',
      keterangan: 'Melempar Jumrah dan Mabit',
      url: 'https://umrahbandung.id/wp-content/uploads/2023/08/melempar-jumrah-di-mina.jpg',
      lat: 21.4231,
      lon: 39.8943,
      rute1: { lat: 21.4240, lon: 39.8950 },
      rute2: { lat: 21.4225, lon: 39.8935 },
      rute3: { lat: 21.4235, lon: 39.8948 },
      rute4: { lat: 21.4218, lon: 39.8930 },
      status: false,
    },
    {
      id: 4,
      nama: 'Makkah Akhir',
      keterangan: 'Tawaf Ifadah dan Sai',
      url: 'https://uici.ac.id/wp-content/uploads/2023/04/png_20230410_170228_0000.png.webp',
      lat: 21.3891,
      lon: 39.8579,
      rute1: { lat: 21.3905, lon: 39.8588 },
      rute2: { lat: 21.3883, lon: 39.8574 },
      rute3: { lat: 21.3890, lon: 39.8593 },
      rute4: { lat: 21.3878, lon: 39.8568 },
      status: false,
    }
  ];

  minaList = [
    {
      id: 0,
      nama: 'Jumrah Ula',
      keterangan: 'Lemparan Pertama',
      url: 'https://nuansantb.id/wp-content/uploads/2024/06/IMG-20240616-WA0171_copy_640x419.jpg',
      lat: 21.3891,
      lon: 39.8579,
      rute1: { lat: 21.3901, lon: 39.8585 },
      rute2: { lat: 21.3880, lon: 39.8570 },
      rute3: { lat: 21.3875, lon: 39.8590 },
      rute4: { lat: 21.3895, lon: 39.8565 },
      status: true,
    },
    {
      id: 1,
      nama: 'Jumrah Wustha',
      keterangan: 'Lemparan Kedua',
      url: 'https://cdn.kemenag.go.id/storage/posts/16_9/big/1718613830.jpg',
      lat: 21.3542,
      lon: 39.9836,
      rute1: { lat: 21.3550, lon: 39.9840 },
      rute2: { lat: 21.3535, lon: 39.9820 },
      rute3: { lat: 21.3548, lon: 39.9830 },
      rute4: { lat: 21.3530, lon: 39.9845 },
      status: false,
    },
    {
      id: 2,
      nama: 'Jumrah Aqabah',
      keterangan: 'Lemparan Terakhir',
      url: 'https://muhammadiyah.or.id/wp-content/uploads/2024/06/lempar-jumrah.jpg',
      lat: 21.3628,
      lon: 39.9406,
      rute1: { lat: 21.3630, lon: 39.9410 },
      rute2: { lat: 21.3620, lon: 39.9400 },
      rute3: { lat: 21.3615, lon: 39.9412 },
      rute4: { lat: 21.3635, lon: 39.9398 },
      status: false,
    },
  ];

  makkahList = [
    {
      id: 0,
      nama: 'Tawaf Ifadah',
      keterangan: 'mengelilingi Kabah sebanyak tujuh kali dengan posisi Kabah di sebelah kiri',
      url: 'https://awsimages.detik.net.id/visual/2023/07/01/jemaah-haji-melaksanakan-tawaf-ifadah-di-dekat-kabah-masjidil-haram-makkah-arab-saudi-sabtu-172023-1.jpeg?w=650&q=80',
      lat: 21.3891,
      lon: 39.8579,
      rute1: { lat: 21.3901, lon: 39.8585 },
      rute2: { lat: 21.3880, lon: 39.8570 },
      rute3: { lat: 21.3875, lon: 39.8590 },
      rute4: { lat: 21.3895, lon: 39.8565 },
      status: true,
    },
    {
      id: 1,
      nama: 'Sai',
      keterangan: 'berjalan atau berlari-lari kecil bolak-balik tujuh kali antara bukit Shafa dan Marwah.',
      url: 'https://nabawimulia.co.id/wp-content/uploads/2023/05/ibadah-Sai.jpg',
      lat: 21.3542,
      lon: 39.9836,
      rute1: { lat: 21.3550, lon: 39.9840 },
      rute2: { lat: 21.3535, lon: 39.9820 },
      rute3: { lat: 21.3548, lon: 39.9830 },
      rute4: { lat: 21.3530, lon: 39.9845 },
      status: false,
    },
    {
      id: 2,
      nama: 'Tawaf Wada',
      keterangan: 'tawaf perpisahan yang dilakukan oleh jemaah haji setelah menyelesaikan semua rangkaian ibadah haji sebelum meninggalkan Makkah.',
      url: 'https://awsimages.detik.net.id/community/media/visual/2019/08/16/592b547f-a2c8-4488-af65-d05a8e398e20_169.jpeg?w=1200',
      lat: 21.3628,
      lon: 39.9406,
      rute1: { lat: 21.3630, lon: 39.9410 },
      rute2: { lat: 21.3620, lon: 39.9400 },
      rute3: { lat: 21.3615, lon: 39.9412 },
      rute4: { lat: 21.3635, lon: 39.9398 },
      status: false,
    },
  ];

  getTempatById(id: number) {
    return this.tempatList.find(t => t.id === id);
  }

  getTempat() {
    return this.tempatList;
  }

  getMina() {
    return this.minaList;
  }
  getMinaById(id: number) {
    return this.minaList.find(t => t.id === id);
  }

  getMakkah() {
    return this.makkahList;
  }
  getMakkahById(id: number) {
    return this.makkahList.find(t => t.id === id);
  }


  async loadStatusFromStorage() {
    const storedStatus = await this.storage.get('status_tempat');
    if (storedStatus) {
      this.tempatList = this.tempatList.map(tempat => {
        const match = storedStatus.find((s: any) => s.id === tempat.id);
        return match ? { ...tempat, status: match.status } : tempat;
      });
    }
  }

  // Simpan status sekarang ke storage
  async saveStatusToStorage() {
    const statusData = this.tempatList.map(({ id, status }) => ({ id, status }));
    await this.storage.set('status_tempat', statusData);
  }

  async updateStatusTempat(id: number, statusBaru: boolean) {
    const tempat = this.tempatList[id];

    if (tempat) {
      tempat.status = statusBaru;
      await this.saveStatusToStorage();

      const cek = await this.storage.get('status_tempat');
      console.log('Status terkini di storage:', cek);

    }
  }

  async resetAllStatus() {
    this.tempatList.forEach(t => t.status = false);
    await this.saveStatusToStorage();
    this.updateStatusTempat(0, true);
  }

  //buat status nya mina
  async loadMinaStatusFromStorage() {
    const storedStatus = await this.storage.get('status_mina');
    if (storedStatus) {
      this.minaList = this.minaList.map(tempat => {
        const match = storedStatus.find((s: any) => s.id === tempat.id);
        return match ? { ...tempat, status: match.status } : tempat;
      });
    }
  }

  async saveMinaStatusToStorage() {
    const statusData = this.minaList.map(({ id, status }) => ({ id, status }));
    await this.storage.set('status_mina', statusData);
  }

  async updateMinaStatusTempat(id: number, statusBaru: boolean) {
    const tempat = this.minaList[id];

    if (tempat) {
      tempat.status = statusBaru;
      await this.saveMinaStatusToStorage();

      const cek = await this.storage.get('status_mina');
      console.log('Status terkini di storage:', cek);

    }
  }

  async resetAllMinaStatus() {
    this.minaList.forEach(t => t.status = false);
    await this.saveMinaStatusToStorage();
    this.updateMinaStatusTempat(0, true);
  }


  //buat status nya makkah
  async loadMakkahStatusFromStorage() {
    const storedStatus = await this.storage.get('status_Makkah');
    if (storedStatus) {
      this.makkahList = this.makkahList.map(tempat => {
        const match = storedStatus.find((s: any) => s.id === tempat.id);
        return match ? { ...tempat, status: match.status } : tempat;
      });
    }
  }
  
  async saveMakkahStatusToStorage() {
    const statusData = this.makkahList.map(({ id, status }) => ({ id, status }));
    await this.storage.set('status_Makkah', statusData);
  }

  async updateMakkahStatusTempat(id: number, statusBaru: boolean) {
    const tempat = this.makkahList[id];

    if (tempat) {
      tempat.status = statusBaru;
      await this.saveMakkahStatusToStorage();

      const cek = await this.storage.get('status_Makkah');
      console.log('Status terkini di storage:', cek);

    }
  }

  async resetAllMakkahStatus() {
    this.minaList.forEach(t => t.status = false);
    await this.saveMakkahStatusToStorage();
    this.updateMakkahStatusTempat(0, true);
  }
}
