import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationTrackerService {
    private apiUrl = 'https://selesai.my.id/emutowif/api/users/update_user_location.php';
    private trackingSub: Subscription | undefined;
    private isTracking = false;

    constructor(private http: HttpClient) { }

    // Mulai pelacakan otomatis tiap 4 detik
    startTracking(userId: number) {
        if (this.isTracking || !userId) return;

        this.isTracking = true;
        console.log(`[GPS Global] Mulai pelacakan untuk User ID: ${userId}`);

        // Eksekusi langsung 1x saat baru aktif
        this.sendCurrentLocation(userId);

        // Lalu looping tiap 4 detik (interval 3-5 detik)
        this.trackingSub = interval(4000).subscribe(() => {
            this.sendCurrentLocation(userId);
        });
    }

    // Hentikan pelacakan (dipanggil saat logout)
    stopTracking() {
        if (this.trackingSub) {
            this.trackingSub.unsubscribe();
            this.trackingSub = undefined;
        }
        this.isTracking = false;
        console.log('[GPS Global] Pelacakan dihentikan.');
    }

    private sendCurrentLocation(userId: number) {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const body = new FormData();
                body.append('user_id', userId.toString());
                body.append('lat', lat.toString());
                body.append('lon', lon.toString());

                this.http.post(this.apiUrl, body).subscribe({
                    next: () => {
                        // Berhasil sinkron ke Leader
                    },
                    error: (err) => {
                        console.warn('[GPS Global] Gagal kirim lokasi:', err);
                    }
                });
            },
            (err) => {
                console.warn('[GPS Global] Geolocation error:', err.message);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }
}