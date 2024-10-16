import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';

interface Consulta {
  id?: string;
  animalName: string;
  date: string;
  time: string;
  service: string;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  animalName: string = '';
  date: string = '';
  time: string = '';
  service: string = '';
  consultaId: string | null = null;

  services: string[] = ['Consulta Geral', 'Vacinação', 'Exames', 'Odontologia']; // Adicione seus serviços aqui

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private authService: AuthService,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.consultaId = params['id'] || null; // Atribui o ID da consulta
      this.animalName = params['animalName'] || ''; // Atribui o nome do animal
      this.date = params['date'] || ''; // Atribui a data
      this.time = params['time'] || ''; // Atribui o horário
      this.service = params['service'] || ''; // Atribui o serviço recebido
    });
  }

  ngOnInit() {}

  async bookService() {
    const consulta: Consulta = {
      animalName: this.animalName,
      date: this.date,
      time: this.time,
      service: this.service,
    };

    try {
      if (this.consultaId) {
        await this.bookingService.editConsulta(this.consultaId, consulta);
      } else {
        await this.bookingService.addConsulta(consulta);
      }
      this.router.navigate(['/historico-consultas']);
    } catch (error) {
      console.error('Erro ao marcar consulta:', error);
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
