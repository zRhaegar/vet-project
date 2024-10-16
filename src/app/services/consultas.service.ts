import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private consultas = [
    {
      id: 1,
      data: new Date(),
      nomeVeterinario: 'Dr. Silva',
      nomeAnimal: 'Rex',
      motivo: 'Check-up anual',
      notas: 'Tudo normal'
    },
    // Adicione mais consultas mockadas aqui
  ];

  constructor() {}

  getConsultas() {
    return this.consultas;
  }

  // Métodos para adicionar, editar e excluir consultas podem ser adicionados aqui
}