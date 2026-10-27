import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocationTrackerService } from './services/location-tracker.service';

export interface UserSession {
    id: number;
    name: string;
    username_email: string;
    role: 'admin' | 'leader' | 'jamaah';
    group_id: number | null;
    lat: number | null;
    lon: number | null;
}

export interface LoginResponse {
    status: string;
    message: string;
    data: UserSession;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://selesai.my.id/emutowif/api/login.php';
    private currentUserSubject = new BehaviorSubject<UserSession | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient, 
        private trackerService: LocationTrackerService
    ) {
        this.loadStoredUser();
    }

    private loadStoredUser(): void {
        const rawData = localStorage.getItem('user_session');
        if (rawData) {
            try {
                const user: UserSession = JSON.parse(rawData);
                this.currentUserSubject.next(user);

                // Jika user login adalah jamaah, langsung aktifkan pelacakan otomatis
                if (user && (user.role === 'jamaah' || user.role === 'leader' || !user.role)) {
                    this.trackerService.startTracking(user.id);
                }
            } catch (e) {
                localStorage.removeItem('user_session');
            }
        }
    }

    login(credentials: { username_email: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
            tap(response => {
                if (response.status === 'success' && response.data) {
                    // Simpan session
                    localStorage.setItem('user_session', JSON.stringify(response.data));
                    this.currentUserSubject.next(response.data);

                    // Nyalakan live tracking setelah user berhasil login
                    if (response.data.role === 'jamaah' || !response.data.role) {
                        this.trackerService.startTracking(response.data.id);
                    }
                }
            })
        );
    }

    logout(): void {
        // Hentikan pelacakan GPS sebelum sesi dihapus
        this.trackerService.stopTracking();

        localStorage.removeItem('user_session');
        this.currentUserSubject.next(null);
    }

    getCurrentUser(): UserSession | null {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }
}