import { Component } from '@angular/core';
import { Router } from '@angular/router'; // <-- à garder

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showLoginForm: boolean = false;

  email: string = '';
  password: string = '';

  constructor(private router: Router) {} // <-- injection du router

  onLoginSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    
    // Exemple : si l'utilisateur est un Sales Manager
    if (this.email === 'imen.sammoud@esprit.tn' && this.password === '1234') {
      this.router.navigate(['/purchasing-manager']); // <-- redirection
    } else if (this.email === 'samra.naffouti@esprit.tn' && this.password === '1234') {
      this.router.navigate(['/sales-manager']);
    } else if (this.email === 'nour.amara@esprit.tn' && this.password === '1234') {
      this.router.navigate(['/finance-manager']);
    } else if (this.email === 'imen.ayed@esprit.tn' && this.password === '1234') {
      this.router.navigate(['/general-manager']);
    } else {
      alert('Identifiants invalides');
    }
  }
}
