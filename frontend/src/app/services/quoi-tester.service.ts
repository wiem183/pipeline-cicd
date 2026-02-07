import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuoiTester } from '../models/quoi-tester.model';

@Injectable({
  providedIn: 'root'
})
export class QuoiTesterService {
  private apiUrl = 'http://localhost:8081/sagem/api/quoi-tester';

  constructor(private http: HttpClient) {}

  // Récupérer les tests, optionnellement filtré par projet
  getAll(projet?: string): Observable<QuoiTester[]> {
    let params = new HttpParams();
    if (projet && projet.trim() !== '') {
      params = params.set('projet', projet);
    }
    return this.http.get<QuoiTester[]>(this.apiUrl, { params });
  }

  // Récupérer la liste des projets disponibles (à créer côté backend)
  getProjets(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/projets`);
  }
}
