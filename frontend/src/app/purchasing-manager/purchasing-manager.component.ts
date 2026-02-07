import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-purchasing-manager',
  templateUrl: './purchasing-manager.component.html',
  styleUrls: ['./purchasing-manager.component.css']
})
export class PurchasingManagerComponent implements OnInit {
  powerBIUrl: SafeResourceUrl;
  powerBIExternalUrl: string = 'https://app.powerbi.com/links/SXDPf1eF1q?ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&pbi_source=linkShare';

  constructor(private sanitizer: DomSanitizer) {
    // URL pour iframe Power BI (embed)
    this.powerBIUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/reportEmbed?reportId=6654954a-2e33-4c1d-b27a-32de8c01c0a9&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730'
    );
  }

  ngOnInit(): void {}

  openPowerBI(): void {
    window.open(this.powerBIExternalUrl, '_blank');
    alert('Le rapport Power BI s\'est ouvert dans un nouvel onglet.\nVous pouvez l\'exporter en PDF ou PowerPoint via le menu "…" dans Power BI.');
  }
}
