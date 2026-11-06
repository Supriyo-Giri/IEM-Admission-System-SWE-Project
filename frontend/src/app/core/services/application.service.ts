import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Application, CreateApplicationPayload, ApplicationDocument } from '../models/application.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);

  private myApplicationSignal = signal<Application | null>(null);
  public readonly myApplication = this.myApplicationSignal.asReadonly();

  submitApplication(payload: CreateApplicationPayload): Observable<ApiResponse<Application>> {
    return this.http.post<ApiResponse<Application>>(
      `${environment.apiUrl}/applications`,
      payload
    ).pipe(
      tap((res) => {
        if (res.data) {
          this.myApplicationSignal.set(res.data);
        }
      })
    );
  }

  getMyApplication(): Observable<ApiResponse<Application>> {
    return this.http.get<ApiResponse<Application>>(
      `${environment.apiUrl}/applications/my-application`
    ).pipe(
      tap((res) => {
        if (res.data) {
          this.myApplicationSignal.set(res.data);
        }
      })
    );
  }

  uploadDocument(file: File, docType: string): Observable<ApiResponse<ApplicationDocument[]>> {
    const formData = new FormData();
    formData.append('document', file);

    const url = `${environment.apiUrl}/applications/upload?docType=${encodeURIComponent(docType)}`;

    return this.http.post<ApiResponse<ApplicationDocument[]>>(url, formData).pipe(
      tap((res) => {
        const current = this.myApplicationSignal();
        if (current && res.data) {
          this.myApplicationSignal.set({
            ...current,
            documents: res.data
          });
        }
      })
    );
  }

  clearState(): void {
    this.myApplicationSignal.set(null);
  }
}

