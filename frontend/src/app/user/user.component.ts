import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  showPowerBI: boolean = true;
  showPowerBI01: boolean = true;
  showPrediction: boolean = false;
  showPrediction1: boolean = false;
  showPrediction2: boolean = false;
  showPrediction3: boolean = false;
  showPrediction4: boolean = false;
  powerBIUrl: SafeResourceUrl;
  powerBIUrl01: SafeResourceUrl;
 
  predictionUrl: SafeResourceUrl;
  predictionUrl1 :SafeResourceUrl;
  predictionUrl2 :SafeResourceUrl;
  predictionUrl3 :SafeResourceUrl;
  predictionUrl4 :SafeResourceUrl;
 

  constructor(private sanitizer: DomSanitizer) {
    // Mets ici ton URL Power BI officielle
    this.powerBIUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/reportEmbed?reportId=1eee0453-6936-4da1-aee1-e56781753583&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730'
    );
    this.powerBIUrl01 = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/reportEmbed?reportId=f15c0587-9139-417b-92f5-6a8b7e5da4ab&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730'
    );
     // Mets ici l'URL de ton serveur Flask déployé
     this.predictionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://127.0.0.1:5000'
    );
    this.predictionUrl1 = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://127.0.0.1:8003'
    );
    this.predictionUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://127.0.0.1:8005'
    );
    this.predictionUrl3 = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://127.0.0.1:8007'
    );
    this.predictionUrl4 = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://127.0.0.1:3000'
    );
  
  }

  showPowerBIView(): void {
    this.showPowerBI = true;
    this.showPowerBI01 =false;
    this.showPrediction = false;
    this.showPrediction1 = false;
    this.showPrediction2 = false;
    this.showPrediction3 = false;
    this.showPrediction4 = false;
    

  }
  showPowerBIView01(): void {
    this.showPowerBI01 =true;
    this.showPowerBI =false;
    this.showPrediction = false;
    this.showPrediction1 = false;
    this.showPrediction2 = false;
    this.showPrediction3 = false;
    this.showPrediction4 = false;
  }
  
  showPredictionView(): void {
    this.showPowerBI = false;
    this.showPowerBI01 =false;
    this.showPrediction = true;
    this.showPrediction1 = false;
    this.showPrediction2 = false;
    this.showPrediction3 = false;
    this.showPrediction4 = false;
  }
  
  showPredictionView1(): void {
    this.showPowerBI = false;
    this.showPowerBI01 =false;
    this.showPrediction = false;
    this.showPrediction1 = true;
    this.showPrediction2 = false;
    this.showPrediction3 = false;
    this.showPrediction4 = false;
  }
  showPredictionView2(): void {
    this.showPowerBI = false;
    this.showPowerBI01 =false;
    this.showPrediction = false;
    this.showPrediction1 = false;
    this.showPrediction2 = true;
    this.showPrediction3 = false;
    this.showPrediction4 = false;

  }
  showPredictionView3(): void {
    this.showPowerBI = false;
    this.showPowerBI01 =false;
    this.showPrediction = false;
    this.showPrediction1 = false;
    this.showPrediction2 = false;
    this.showPrediction3 = true;
    this.showPrediction4 = false;
  }
  showPredictionView4(): void {
    this.showPowerBI = false;
    this.showPowerBI01 =false;
    this.showPrediction = false;
    this.showPrediction1 = false;
    this.showPrediction2 = false;
    this.showPrediction3 = false;
    this.showPrediction4 = true;
  }


}

