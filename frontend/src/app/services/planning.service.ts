import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Planning {
  famille: string;
  fonction: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = 'http://localhost:8081/sagem/api/planning';

  constructor(private http: HttpClient) {}

  getPlannings(): Observable<any[]> {
    return this.http.get<Planning[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate)
      })))
    );
  }
}