import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Application,
  ApplicationsPagination,
  DashboardStats,
  ApplicationStatus
} from '../models/application.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${environment.apiUrl}/admin/stats`);
  }

  getAllApplications(filters: {
    status?: string;
    stream?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Observable<ApiResponse<ApplicationsPagination>> {
    let params = new HttpParams();

    if (filters.status && filters.status !== 'ALL') {
      params = params.set('status', filters.status);
    }
    if (filters.stream && filters.stream !== 'ALL') {
      params = params.set('stream', filters.stream);
    }
    if (filters.search && filters.search.trim() !== '') {
      params = params.set('search', filters.search.trim());
    }
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<ApiResponse<ApplicationsPagination>>(
      `${environment.apiUrl}/admin/applications`,
      { params }
    );
  }

  getApplicationById(id: string): Observable<ApiResponse<Application>> {
    return this.http.get<ApiResponse<Application>>(
      `${environment.apiUrl}/admin/applications/${id}`
    );
  }

  updateApplicationStatus(
    id: string,
    status: ApplicationStatus
  ): Observable<ApiResponse<Application>> {
    return this.http.put<ApiResponse<Application>>(
      `${environment.apiUrl}/admin/applications/${id}/status`,
      { status }
    );
  }
}

