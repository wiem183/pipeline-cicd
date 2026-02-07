import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sales-manager',
  templateUrl: './sales-manager.component.html',
  styleUrls: ['./sales-manager.component.css']
})
export class SalesManagerComponent implements OnInit {
  powerBIUrl: SafeResourceUrl;
  powerBIExternalUrl: string = 'https://app.powerbi.com/links/k-mZPDrpi1?ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&pbi_source=linkShare'; // mettre ici ton lien de visualisation publique (non embed)

  constructor(private sanitizer: DomSanitizer) {
    // URL Power BI intégrée
    this.powerBIUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/reportEmbed?reportId=0c06d7bf-e94c-4476-b3e1-3bfc0d9e5a74&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730'
    );
  }

  ngOnInit(): void {
    // Initialisation du composant (vide ici)
  }
  openPowerBI(): void {
    window.open(this.powerBIExternalUrl, '_blank');
    alert('Le rapport Power BI s\'est ouvert dans un nouvel onglet.\nVous pouvez l\'exporter en PDF ou PowerPoint via le menu "…" dans Power BI.');
  }
}
