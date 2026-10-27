import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserItem {
  id?: number;
  name: string;
  username_email: string;
  password?: string;
  role: 'admin' | 'leader' | 'jamaah';
  group_id?: number | null;
  lat?: number | null;
  lon?: number | null;
}

export interface GroupResponseItem {
  id: number;
  name: string;
  leader_id: number | null;
  leader_name: string;
  description: string;
  total_jamaah: number;
}

export interface LeaderOption {
  id: number;
  name: string;
  email: string;
}

export interface ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
}

export interface JamaahOption {
  id: number;
  name: string;
  email: string;
  group_id?: number | null;
}

export interface GroupDetailResponse {
  group: {
    id: number;
    name: string;
    description: string;
    leader_id: number | null;
    leader_name: string;
    leader_email: string;
  };
  members: Array<{
    id: number;
    name: string;
    email: string;
    lat: number | null;
    lon: number | null;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUserUrl = 'https://selesai.my.id/emutowif/api/users';
  private baseGroupUrl = 'https://selesai.my.id/emutowif/api/groups';

  constructor(private http: HttpClient) { }

  // USER APIS
  getUsers(): Observable<ApiResponse<UserItem[]>> {
    return this.http.get<ApiResponse<UserItem[]>>(`${this.baseUserUrl}/read.php`);
  }

  createUser(payload: { name: string; username_email: string; password: string; role: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUserUrl}/create.php`, payload);
  }

  // GROUP APIS
  getGroups(): Observable<ApiResponse<GroupResponseItem[]>> {
    return this.http.get<ApiResponse<GroupResponseItem[]>>(`${this.baseGroupUrl}/read.php`);
  }

  getLeaders(): Observable<ApiResponse<LeaderOption[]>> {
    return this.http.get<ApiResponse<LeaderOption[]>>(`${this.baseGroupUrl}/get_leaders.php`);
  }

  createGroup(payload: { name: string; leader_id: number | null; description: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseGroupUrl}/create.php`, payload);
  }

  updateGroup(payload: { id: number; name: string; leader_id: number | null; description: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseGroupUrl}/update.php`, payload);
  }

  getAvailableJamaah(groupId?: number): Observable<ApiResponse<JamaahOption[]>> {
    const url = groupId ? `${this.baseGroupUrl}/get_available_jamaah.php?group_id=${groupId}` : `${this.baseGroupUrl}/get_available_jamaah.php`;
    return this.http.get<ApiResponse<JamaahOption[]>>(url);
  }

  getGroupDetail(groupId: number): Observable<ApiResponse<GroupDetailResponse>> {
    return this.http.get<ApiResponse<GroupDetailResponse>>(`${this.baseGroupUrl}/detail.php?id=${groupId}`);
  }

  createGroupWithMembers(payload: { name: string; leader_id: number | null; description: string; member_ids: number[] }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseGroupUrl}/create.php`, payload);
  }

  updateGroupWithMembers(payload: { id: number; name: string; leader_id: number | null; description: string; member_ids: number[] }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseGroupUrl}/update.php`, payload);
  }
}