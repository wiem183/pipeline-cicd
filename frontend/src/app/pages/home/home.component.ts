import { Component } from '@angular/core';
import { Router } from '@angular/router'; // <-- ajoute cette ligne

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {} // <-- ajoute le constructeur

  goToDashboard() { // <-- ajoute cette fonction
    this.router.navigate(['/dashboard']);
  }
  

}
