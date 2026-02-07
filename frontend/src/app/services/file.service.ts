import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FileService {
  private baseUrl = 'http://localhost:8081/sagem/api/files';

  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      responseType: 'text' // Si le backend ne renvoie pas de JSON
    });
  }

  runEtlScript(fileName: string, type: string) {
    const params = new HttpParams()
      .set('fileName', fileName)
      .set('type', type);

    return this.http.post(`${this.baseUrl}/run-etl`, {}, { params });
  }
}