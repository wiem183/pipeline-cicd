import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BudgetCMS } from '../models/budget-cms.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetCmsService {
  private apiUrl = 'http://localhost:8081/sagem/api/budget-cms';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BudgetCMS[]> {
  return this.http.get<BudgetCMS[]>(this.apiUrl).pipe(
    map(data => {
      console.log('Données brutes API:', data);
      return data.filter(item => item.coutsInterfaceTest != null && item.coutsInterfaceTest > 0);
    })
  );
}

  getById(id: string): Observable<BudgetCMS> {
    return this.http.get<BudgetCMS>(`${this.apiUrl}/${id}`);
  }

  create(budget: BudgetCMS): Observable<BudgetCMS> {
    return this.http.post<BudgetCMS>(this.apiUrl, budget);
  }

  update(id: string, budget: BudgetCMS): Observable<BudgetCMS> {
    return this.http.put<BudgetCMS>(`${this.apiUrl}/${id}`, budget);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}