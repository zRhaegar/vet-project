import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService, Consulta } from '../services/booking.service'; // Importa a interface Consulta
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-historico-consultas',
  templateUrl: './historico-consultas.page.html',
  styleUrls: ['./historico-consultas.page.scss'],
})
export class HistoricoConsultasPage implements OnInit {
  consultas: Consulta[] = []; // Usa a interface Consulta

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadConsultas();
  }

  async loadConsultas() {
    try {
      this.consultas = await this.bookingService.getConsultas();
      console.log('Consultas carregadas:', this.consultas); // Verifique no console
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  }
  
  async cancelConsulta(id: string) {
    await this.bookingService.cancelConsulta(id);
    this.loadConsultas();
  }

  async editarConsulta(id: string) {
    const consulta = this.consultas.find(c => c.id === id);
    if (consulta) {
      this.router.navigate(['/booking'], { 
        queryParams: { 
          id: consulta.id, 
          service: consulta.service, 
          animalName: consulta.animalName, 
          date: consulta.date, 
          time: consulta.time 
        } 
      });
    }
  }
  
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
