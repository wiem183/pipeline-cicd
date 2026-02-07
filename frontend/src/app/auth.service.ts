import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/sagem/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('jwtToken', response.token);
      })
    );
  }

  register(username: string, email: string, password: string, role: string) {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password, role });
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
