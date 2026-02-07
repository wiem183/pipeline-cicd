import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuoiTester } from '../models/quoi-tester.model';

@Injectable({
  providedIn: 'root'
})
export class QuoiTesterService {

  private apiUrl = 'http://localhost:8081/sagem/api/quoi-tester';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer TOUTES les données
  getAll(): Observable<QuoiTester[]> {
    return this.http.get<QuoiTester[]>(this.apiUrl);
  }
}
