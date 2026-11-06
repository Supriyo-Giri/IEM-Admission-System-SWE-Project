import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  isMenuCollapsed = signal(true);

  toggleMenu(): void {
    this.isMenuCollapsed.update(val => !val);
  }

  closeMenu(): void {
    this.isMenuCollapsed.set(true);
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }
}

