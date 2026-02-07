import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = 'USER';
  showModal = true;
  showSuccessPopup = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.username, this.email, this.password, this.role).subscribe({
      next: () => {
        console.log('✅ Inscription réussie');
        this.showSuccessPopup = true;

        // Ferme le modal après 2 secondes
        setTimeout(() => {
          this.showModal = false;
          this.showSuccessPopup = false;
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        console.error('❌ Erreur lors de l’inscription', err);
        alert(err.error || 'Une erreur est survenue');
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/home']);
  }
}
