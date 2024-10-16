import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Carregar resultado do redirecionamento ao inicializar a página
    this.authService.handleRedirectResult().then(user => {
      if (user) {
        if (user.emailVerified) {
          this.router.navigateByUrl('/home', { replaceUrl: true });
        } else {
          this.authService.logout(); // Logout se o e-mail não estiver verificado
          this.showAlert('Por favor, verifique seu e-mail antes de fazer login.');
        }
      }
    }).catch(error => {
      console.error('Erro ao lidar com o redirecionamento:', error);
    });
  }

  get emailControl() {
    return this.credentials.get('email');
  }

  get passwordControl() {
    return this.credentials.get('password');
  }

  async loginWithGoogle() {
    const loading = await this.loadingController.create();
    await loading.present();

    await this.authService.loginWithGoogle();
    await loading.dismiss();
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.authService.register(this.credentials.value);
      if (user) {
        this.successMessage = 'Um e-mail de verificação foi enviado. Por favor, verifique sua caixa de entrada.';
        this.showAlert(this.successMessage);
      } else {
        this.errorMessage = 'Falha ao registrar. Por favor, tente novamente!';
        this.showAlert(this.errorMessage);
      }
    } catch (error) {
      this.errorMessage = 'Falha ao registrar. Por favor, tente novamente!';
      console.error(error);
      this.showAlert(this.errorMessage);
    } finally {
      await loading.dismiss();
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.authService.login(this.credentials.value);
      if (user && user.emailVerified) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        this.errorMessage = 'Usuário ou senha incorretas.';
        this.showAlert(this.errorMessage);
      }
    } catch (error: any) {
      this.errorMessage = 'Usuário ou senha incorretas.';
      this.showAlert(this.errorMessage);
    } finally {
      await loading.dismiss();
    }
  }

  async showAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message,
      buttons: ['OK']
    });
    await alert.present();

    // Remove a mensagem após 5 segundos, exceto para mensagens de sucesso no registro
    if (this.successMessage) {
      // Não remove o alert para sucesso
    } else {
      setTimeout(() => {
        alert.dismiss();
      }, 5000);
    }
  }
}
