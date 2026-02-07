import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-finance-manager',
  templateUrl: './finance-manager.component.html',
  styleUrls: ['./finance-manager.component.css']
})
export class FinanceManagerComponent implements OnInit, OnDestroy {
  powerBIUrl: SafeResourceUrl;
  powerBIExternalUrl: string = 'https://app.powerbi.com/links/QW5VfTJRxi?ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&pbi_source=linkShare';


  constructor(private sanitizer: DomSanitizer) {
    // Initialisation de l'URL Power BI
    this.powerBIUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/reportEmbed?reportId=c9aa51d7-0cd5-4312-a5bd-fc17c6790742&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730'
      
    );
  }

  ngOnInit(): void {
    // Rien à initialiser pour le moment
  }
    openPowerBI(): void {
    window.open(this.powerBIExternalUrl, '_blank');
    alert('Le rapport Power BI s\'est ouvert dans un nouvel onglet.\nVous pouvez l\'exporter en PDF ou PowerPoint via le menu "…" dans Power BI.');
  }

  ngOnDestroy(): void {
    // Rien à nettoyer
  }
}
