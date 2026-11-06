import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly TOKEN_KEY = 'iem_auth_token';
  private readonly USER_KEY = 'iem_auth_user';

  private currentUserSignal = signal<User | null>(this.getStoredUser());
  private tokenSignal = signal<string | null>(this.getStoredToken());

  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly token = this.tokenSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  public readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
  public readonly isApplicant = computed(() => this.currentUserSignal()?.role === 'applicant');

  constructor() {
    if (this.isBrowser && this.tokenSignal()) {
      this.loadCurrentUser().subscribe({
        error: () => this.clearSession()
      });
    }
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap((res) => {
        if (res.data?.token && res.data?.user) {
          this.setSession(res.data.token, res.data.user);
        }
      })
    );
  }

  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'applicant' | 'admin';
  }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${environment.apiUrl}/auth/register`,
      userData
    );
  }

  loadCurrentUser(): Observable<ApiResponse<User> | null> {
    if (!this.getToken()) {
      return of(null);
    }
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/auth/me`).pipe(
      tap((res) => {
        if (res.data) {
          this.currentUserSignal.set(res.data);
          if (this.isBrowser) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
          }
        }
      }),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      next: () => {},
      error: () => {}
    });
    this.clearSession();
    this.toast.info('You have been logged out successfully.');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setSession(token: string, user: User): void {
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private clearSession(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  private getStoredToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private getStoredUser(): User | null {
    if (this.isBrowser) {
      const data = localStorage.getItem(this.USER_KEY);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}

