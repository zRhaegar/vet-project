import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage {
  constructor(private router: Router, private authService: AuthService) {}

  agendarServico(servico: string) {
    this.router.navigate(['/booking'], { state: { service: servico } }); // Usando 'state' para passar o serviço
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
