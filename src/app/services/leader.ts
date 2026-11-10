import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Jamaah {
  id: number;
  name: string;
  role?: string;
  group_id: number;
  group_name?: string;
  rombongan_id?: number | null;
  rombongan_name?: string | null;
  lat: number | null;
  lon: number | null;
  last_located_at: string | null;
}

export interface GroupInfo {
  id: number;
  name: string;
  type: 'kloter' | 'rombongan' | 'regu';
  parent_id: number | null;
  parent_name: string | null;
  ibadah_type: 'haji' | 'umrah';
}

export interface SubGroup {
  id: number;
  name: string;
  type: 'kloter' | 'rombongan' | 'regu';
  parent_id: number | null;
  parent_name: string | null;
  leader_id: number | null;
  leader_name: string;
}

export interface LeaderUser {
  id: number;
  name: string;
  role: string;
  group_id: number;
  group_name?: string;
  group_type?: 'kloter' | 'rombongan' | 'regu';
  parent_group_id?: number | null;
  parent_group_name?: string | null;
  lat: number | null;
  lon: number | null;
  last_located_at: string | null;
}

export interface GetJamaahResponse {
  status: string;
  message?: string;
  group_info: GroupInfo;
  parent_leader: LeaderUser | null;
  sub_groups: SubGroup[];
  sub_leaders: LeaderUser[];
  data: Jamaah[];
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

export interface GetJamaahOptions {
  leaderId?: number;
  subGroupId?: number;
  includeJamaah?: number;
}

export interface SearchResultItem {
  type: 'group' | 'user';
  category: 'rombongan' | 'regu' | 'jamaah' | 'leader';
  id: number;
  name: string;
  roleLabel: string;
  group_id: number;
  group_name: string;
  parent_group_id?: number | null;
  parent_group_name?: string | null;
  leader_name?: string | null;
  lat: number | null;
  lon: number | null;
  last_located_at?: string | null;
}

export interface SearchHierarchyResponse {
  status: string;
  total: number;
  query: string;
  data: SearchResultItem[];
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

  getJamaahList(groupId: number, options?: GetJamaahOptions): Observable<GetJamaahResponse> {
    let params = new HttpParams().set('group_id', groupId.toString());

    if (options?.leaderId) {
      params = params.set('leader_id', options.leaderId.toString());
    }
    if (options?.subGroupId) {
      params = params.set('sub_group_id', options.subGroupId.toString());
    }
    if (options?.includeJamaah !== undefined) {
      params = params.set('include_jamaah', options.includeJamaah.toString());
    }

    return this.http.get<GetJamaahResponse>(`${this.baseUrl}/get_jamaah.php`, { params });
  }

  getJamaahDetail(userId: number): Observable<{ status: string; data: JamaahDetailResponse }> {
    return this.http.get<{ status: string; data: JamaahDetailResponse }>(`${this.baseUrl}/get_jamaah_detail.php?user_id=${userId}`);
  }

  searchHierarchy(groupId: number, query: string): Observable<SearchHierarchyResponse> {
    const params = new HttpParams()
      .set('group_id', groupId.toString())
      .set('q', query);

    return this.http.get<SearchHierarchyResponse>(`${this.baseUrl}/search_hierarchy.php`, { params });
  }
}
