import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  showModal = true;

  constructor(
    private authService: AuthService,
    private router: Router // ✅ ajout ici
  ) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Connexion réussie ✅');
        this.showModal = false;

        // ✅ Redirection vers la page d'accueil
        this.router.navigate(['/home']);
      },
      error: err => {
        console.error('Erreur de login ❌', err);
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/home']);
  }
}
