import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Jamaah {
  id: number;
  name: string;
  lat: number | null;
  lon: number | null;
  last_located_at: string;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  image_url: string;
  center_lat: number;
  center_lon: number;
  status: 'belum' | 'proses' | 'selesai';
  completed_at: string | null;
}

export interface JamaahDetailResponse {
  user: Jamaah & { role: string; group_id: number };
  activities: Activity[];
}

@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  private baseUrl = 'https://selesai.my.id/emutowif/api/leader';

  constructor(private http: HttpClient) {}

  updateLocation(userId: number, lat: number, lon: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_location.php`, { user_id: userId, lat, lon });
  }

  getJamaahList(groupId: number): Observable<{ status: string; data: Jamaah[] }> {
    return this.http.get<{ status: string; data: Jamaah[] }>(`${this.baseUrl}/get_jamaah.php?group_id=${groupId}`);
  }

  getJamaahDetail(userId: number): Observable<{ status: string; data: JamaahDetailResponse }> {
    return this.http.get<{ status: string; data: JamaahDetailResponse }>(`${this.baseUrl}/get_jamaah_detail.php?user_id=${userId}`);
  }
}