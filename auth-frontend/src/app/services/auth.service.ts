import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isAuthenticatedSubject.next(!!this.getToken());
  }

  register(registerData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(loginData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/authenticate`, loginData)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorResponse: ErrorResponse;
    
    if (error.error instanceof ErrorEvent) {
      // İstemci tarafı hatası
      errorResponse = {
        code: 'CLIENT_ERROR',
        message: 'Bir hata oluştu, lütfen tekrar deneyin.',
        severity: 'ERROR'
      };
    } else {
      // Backend'den gelen hata
      if (error.error && typeof error.error === 'object') {
        errorResponse = error.error as ErrorResponse;
      } else {
        // Eğer backend'den gelen hata beklenen formatta değilse
        errorResponse = {
          code: error.status === 401 ? 'AUTHENTICATION_ERROR' : 'SERVER_ERROR',
          message: error.status === 401 ? 'E-posta veya şifre hatalı' : 'Bir hata oluştu, lütfen tekrar deneyin.',
          severity: 'ERROR'
        };
      }
    }
    
    return throwError(() => errorResponse);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
