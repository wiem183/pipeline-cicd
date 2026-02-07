import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BudgetINTEG } from '../models/budget-integ.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetIntegService {
  private apiUrl = 'http://localhost:8081/sagem/api/budget-integ';

  constructor(private http: HttpClient) {}
getAll(): Observable<BudgetINTEG[]> {
  return this.http.get<BudgetINTEG[]>(this.apiUrl).pipe(
    map((data: BudgetINTEG[]) =>
      data.filter(item => item.coutsInterfaceTest != null && item.coutsInterfaceTest > 0)
    )
  );
}


  getById(id: string): Observable<BudgetINTEG> {
    return this.http.get<BudgetINTEG>(`${this.apiUrl}/${id}`);
  }

  create(budget: BudgetINTEG): Observable<BudgetINTEG> {
    return this.http.post<BudgetINTEG>(this.apiUrl, budget);
  }

  update(id: string, budget: BudgetINTEG): Observable<BudgetINTEG> {
    return this.http.put<BudgetINTEG>(`${this.apiUrl}/${id}`, budget);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}