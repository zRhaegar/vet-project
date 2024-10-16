import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'As senhas não correspondem.';
      return;
    }

    try {
      await this.authService.changePassword(this.newPassword);
      this.router.navigate(['/']); // Redirecionar para a página inicial ou outra
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Ocorreu um erro desconhecido.';
      }
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']); // Redirecionar para a página inicial ou outra após logout
  }
}
