import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      // 1. Cek update segera saat aplikasi pertama dibuka
      this.swUpdate.checkForUpdate().catch((err) => {
        console.warn('Gagal cek update service worker:', err);
      });

      // 2. Cek berkala setiap 60 detik selama aplikasi berjalan
      setInterval(() => {
        this.swUpdate.checkForUpdate().catch((err) => {
          console.warn('Gagal cek update interval:', err);
        });
      }, 60000);

      // 3. Jika versi baru sudah siap (terdownload di background), refresh aplikasi otomatis
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          console.log('Versi baru ditemukan, memuat ulang aplikasi...');
          document.location.reload();
        });
    }
  }
}
