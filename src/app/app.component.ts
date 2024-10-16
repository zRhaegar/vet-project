import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from 'firebase/auth';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  email: string | null = null;
  user$: Observable<User | null>;
  darkMode: boolean = false;


  constructor(private authService: AuthService) {
    // Inicializa user$ no construtor
    this.user$ = of(null); // ou inicialize com um Observable real se preferir
  }

  ngOnInit() {
    console.log('Iniciando AppComponent...');
    this.user$ = this.authService.getUser();
    this.user$.subscribe(user => {
      this.email = user ? user.email : null;
      console.log('E-mail do usuário:', this.email);
    });

    this.authService.handleRedirectResult().then(user => {
      if (user) {
        console.log('Usuário logado após redirecionamento:', user);
      } else {
        console.log('Nenhum usuário logado após redirecionamento.');
      }
    });
  }
  async logout() {
    await this.authService.logout();
    // Redirecionar ou fazer outra ação após sair
  }
}
