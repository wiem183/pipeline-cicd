import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
   powerBIUrl: SafeResourceUrl;


  constructor(private sanitizer: DomSanitizer) {
    // Initialisation de l'URL Power BI
    this.powerBIUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/reportEmbed?reportId=52ceae31-4024-4a6d-a0e9-d91167ee2cfe&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730'
    );
  }

  ngOnInit(): void {
    // Rien à initialiser pour le moment
  }
  openPowerBI(): void {
    const powerBIExternalUrl = 'https://app.powerbi.com/links/11Ish6Q5UD?ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&pbi_source=linkShare';
    window.open(powerBIExternalUrl, '_blank');
    alert('Le rapport Power BI s\'est ouvert dans un nouvel onglet.\nVous pouvez l\'exporter en PDF ou PowerPoint via le menu "…" dans Power BI.');
  }

  ngOnDestroy(): void {
    // Rien à nettoyer
  }
}