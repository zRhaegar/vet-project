import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Pet {
  id?: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  idNumber?: string; 
  photoUrl?: string | null; 
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  constructor(private firestore: AngularFirestore) {}

  getPets(userId: string): Observable<Pet[]> {
    return this.firestore.collection<Pet>(`users/${userId}/pets`).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Pet;
        const id = a.payload.doc.id;
        return { ...data, id, idNumber: id };
      }))
    );
  }

  addPet(userId: string, pet: Pet): Promise<any> {
    return this.firestore.collection(`users/${userId}/pets`).add(pet);
  }

  updatePet(userId: string, petId: string, pet: Pet): Promise<void> {
    return this.firestore.doc(`users/${userId}/pets/${petId}`).update(pet);
  }

  deletePet(userId: string, petId: string): Promise<void> {
    return this.firestore.doc(`users/${userId}/pets/${petId}`).delete();
  }
}