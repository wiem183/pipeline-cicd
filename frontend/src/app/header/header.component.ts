import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    public authService: AuthService, // public pour pouvoir l'utiliser dans le template HTML
    private router: Router
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/home']);  // redirige vers la page d'accueil après logout
  }
}