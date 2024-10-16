import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';
  message: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async resetPassword() {
    try {
      await this.authService.sendPasswordResetEmail(this.email);
      this.message = 'Um e-mail de redefinição de senha foi enviado!';
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Ocorreu um erro desconhecido.';
      }
    }
  }
}
