import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  etlType: string = ''; // Budget, Test, Planning
  message: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;

  baseUrl = 'http://localhost:8081/sagem/api/files';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.message = '';
    this.isSuccess = false;
  }

  uploadAndStore(): void {
    if (!this.selectedFile) {
      this.setMessage('Veuillez sélectionner un fichier.', false);
      return;
    }
    if (!this.etlType) {
      this.setMessage('Veuillez choisir un type de données.', false);
      return;
    }

    this.isLoading = true;
    this.message = 'Stockage et traitement en cours...';

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('type', this.etlType);

    this.http.post(`${this.baseUrl}/upload-and-run`, formData, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.isLoading = false;
          this.setMessage(this.getErrorMessage(error), false);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.setMessage(res || 'Données stockées et script exécuté avec succès ! ✅', true);
          this.selectedFile = null;
        }
      });
  }

  private setMessage(msg: string, success: boolean) {
    this.message = msg;
    this.isSuccess = success;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Erreur client : ${error.error.message} ❌`;
    } else {
      if (typeof error.error === 'string' && error.error) {
        return `Erreur serveur : ${error.error} ❌`;
      } else if (error.error?.message) {
        return `Erreur serveur : ${error.error.message} ❌`;
      } else {
        return `Erreur inconnue (${error.status} ${error.statusText}) ❌`;
      }
    }
  }
}
