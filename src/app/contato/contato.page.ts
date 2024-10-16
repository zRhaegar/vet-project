import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.page.html',
  styleUrls: ['./contato.page.scss'],
})
export class ContatoPage implements OnInit {
  mapUrl: SafeResourceUrl = '';
  navigationUrl: string = ''; // URL de navegação

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    const address = 'Av. Cesário de Melo, 2541, Campo Grande';
    const coords = await this.getCoordinates(address);
    this.displayMap(coords.lat, coords.lon);
    this.createNavigationUrl(coords.lat, coords.lon); // Cria a URL de navegação
  }

  async getCoordinates(address: string) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    } else {
      throw new Error('Endereço não encontrado');
    }
  }

  displayMap(lat: number, lon: number) {
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&marker=${lat},${lon}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  createNavigationUrl(lat: number, lon: number) {
    this.navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`; // URL de navegação
  }

  navigate() {
    window.location.href = this.navigationUrl; // Redireciona na mesma aba
  }
  

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
