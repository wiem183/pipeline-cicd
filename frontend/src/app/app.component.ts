import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pi';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLoginSubmit() {
    // Vérifier les informations d'identification (cela pourrait être une vérification côté serveur)
    if (this.email === 'boukhris.nour@esprit.tn' && this.password === 'pass123') {
      // Rediriger vers la page souhaitée après la connexion
      this.router.navigate(['/dashboard']); // Assurez-vous que '/dashboard' est une route définie
    } else {
      alert('E-mail ou mot de passe incorrect');
    }
  }
}
