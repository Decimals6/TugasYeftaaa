import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserRole = 'admin' | 'ketua_kloter' | 'ketua_rombongan' | 'ketua_regu' | 'jamaah' | 'leader';
export type GroupType = 'kloter' | 'rombongan' | 'regu';

export interface UserItem {
  id?: number;
  name: string;
  username_email: string;
  password?: string;
  role: UserRole;
  ibadah_type?: 'haji' | 'umrah';
  group_id?: number | null;
  group_name?: string | null;
  group_type?: GroupType | null;
  lat?: number | null;
  lon?: number | null;
}

export interface GroupResponseItem {
  id: number;
  name: string;
  type: GroupType;
  parent_id: number | null;
  parent_name?: string | null;
  ibadah_type: 'haji' | 'umrah';
  leader_id: number | null;
  leader_name: string;
  leader_role?: string | null;
  description: string;
  total_subgroups?: number;
  total_jamaah: number;
}

export interface LeaderOption {
  id: number;
  name: string;
  email: string;
  role: string;
  group_id: number | null;
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

export interface SubGroupOption {
  id: number;
  name: string;
  type: GroupType;
  leader_name: string;
  total_jamaah: number;
}

export interface GroupDetailResponse {
  group: {
    id: number;
    name: string;
    type: GroupType;
    parent_id: number | null;
    parent_name: string | null;
    ibadah_type: 'haji' | 'umrah';
    leader_id: number | null;
    leader_name: string;
    leader_email: string;
    description: string;
  };
  sub_groups?: SubGroupOption[];
  members: Array<{
    id: number;
    name: string;
    email: string;
    group_id?: number | null;
    group_name?: string;
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

  getUsers(): Observable<ApiResponse<UserItem[]>> {
    return this.http.get<ApiResponse<UserItem[]>>(`${this.baseUserUrl}/read.php`);
  }

  createUser(payload: {
    name: string;
    username_email: string;
    password: string;
    role: string;
    ibadah_type: 'haji' | 'umrah';
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUserUrl}/create.php`, payload);
  }

  getGroups(): Observable<ApiResponse<GroupResponseItem[]>> {
    return this.http.get<ApiResponse<GroupResponseItem[]>>(`${this.baseGroupUrl}/read.php`);
  }

  getLeaders(
    ibadahType: 'haji' | 'umrah',
    groupType: GroupType = 'regu',
    groupId?: number
  ): Observable<ApiResponse<LeaderOption[]>> {
    let url = `${this.baseGroupUrl}/get_leaders.php?ibadah_type=${ibadahType}&type=${groupType}`;
    if (groupId) {
      url += `&group_id=${groupId}`;
    }
    return this.http.get<ApiResponse<LeaderOption[]>>(url);
  }

  createGroup(payload: {
    name: string;
    type: GroupType;
    parent_id?: number | null;
    ibadah_type: 'haji' | 'umrah';
    leader_id: number | null;
    description: string;
    member_ids?: number[];
    sub_group_ids?: number[];
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseGroupUrl}/create.php`, payload);
  }

  updateGroup(payload: {
    id: number;
    name: string;
    type?: GroupType;
    parent_id?: number | null;
    leader_id: number | null;
    description: string;
    member_ids?: number[];
    sub_group_ids?: number[];
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseGroupUrl}/update.php`, payload);
  }

  updateGroupWithMembers(payload: any): Observable<ApiResponse> {
    return this.updateGroup(payload);
  }

  createGroupWithMembers(payload: any): Observable<ApiResponse> {
    return this.createGroup(payload);
  }

  getAvailableJamaah(
    ibadahType: 'haji' | 'umrah',
    groupId?: number
  ): Observable<ApiResponse<JamaahOption[]>> {
    let url = `${this.baseUserUrl}/../groups/get_available_jamaah.php?ibadah_type=${ibadahType}`;
    if (groupId) {
      url += `&group_id=${groupId}`;
    }
    return this.http.get<ApiResponse<JamaahOption[]>>(url);
  }

  getGroupDetail(groupId: number): Observable<ApiResponse<GroupDetailResponse>> {
    return this.http.get<ApiResponse<GroupDetailResponse>>(`${this.baseGroupUrl}/detail.php?id=${groupId}`);
  }
}