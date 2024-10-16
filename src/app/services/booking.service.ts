import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, doc, deleteDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

export interface Consulta {
  id?: string;
  animalName: string;
  date: string;
  time: string;
  service: string;
  status?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addConsulta(consulta: Consulta) {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    
    try {
      await addDoc(collection(this.firestore, 'consultas'), {
        ...consulta,
        userId: userId,
      });
    } catch (error) {
      console.error('Erro ao adicionar consulta:', error);
    }
  }

  async getConsultas(): Promise<Consulta[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.log('Usuário não autenticado');
      return [];
    }
    
    const consultasRef = collection(this.firestore, 'consultas');
    const q = query(consultasRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const consultas: Consulta[] = snapshot.docs.map(doc => {
      const data = { id: doc.id, ...doc.data() } as Consulta;

      // Verifica se a consulta já passou da data e define o status
      const consultaDate = new Date(`${data.date}T${data.time}`); // Formata a data e hora
      data.status = consultaDate < new Date() ? 'Concluída' : 'Pendente';

      return data;
    });

    console.log('Consultas do Firestore:', consultas);
    return consultas;
  }

  async cancelConsulta(id: string): Promise<void> {
    const consultaRef = doc(this.firestore, 'consultas', id);
    try {
      await deleteDoc(consultaRef);
      console.log('Consulta cancelada com sucesso:', id);
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
    }
  }

  async editConsulta(id: string, updatedConsulta: Consulta): Promise<void> {
    const consultaRef = doc(this.firestore, 'consultas', id);
    try {
      await setDoc(consultaRef, updatedConsulta, { merge: true });
      console.log('Consulta editada com sucesso:', id);
    } catch (error) {
      console.error('Erro ao editar consulta:', error);
    }
  }
}
