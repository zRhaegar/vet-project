import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

// Definindo a interface para o perfil do usuário
interface UserProfile {
  id?: string; // opcional
  email: string;
  imageUrl?: string | null; // pode ser string ou null
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {}

  async getUserProfile(): Promise<UserProfile | null> {
    const user = this.auth.currentUser;

    if (!user) {
      console.warn('Usuário não autenticado');
      return null; // Retorna null se o usuário não estiver autenticado
    }

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const data = await docData(userDocRef, { idField: 'id' }).toPromise();

    console.log('Dados do perfil do usuário:', data); // Log dos dados do perfil
    return data ? (data as UserProfile) : null; // Retorna UserProfile ou null
  }

  async uploadImage(cameraFile: Photo): Promise<boolean | null> {
    const user = this.auth.currentUser;

    if (!user) {
      console.warn('Usuário não autenticado ao tentar fazer upload da imagem');
      throw new Error('User not authenticated');
    }

    const path = `uploads/${user.uid}/profile.webp`;
    const storageRef = ref(this.storage, path);

    try {
      if (!cameraFile.base64String) {
        throw new Error('No image data available');
      }

      console.log('Fazendo upload da imagem para o storage...', path);
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      console.log('Imagem carregada com sucesso! URL:', imageUrl);

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, { imageUrl }, { merge: true }); // Usando merge para não sobrescrever outros campos

      return true;
    } catch (e) {
      console.error('Erro ao fazer upload da imagem:', e);
      return null;
    }
  }
}
