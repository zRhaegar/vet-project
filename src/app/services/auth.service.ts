import { Injectable } from '@angular/core';
import { User, updatePassword as firebaseUpdatePassword, sendEmailVerification } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState, GoogleAuthProvider, signInWithRedirect, getRedirectResult, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

interface Credentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  // Registrar um novo usuário
  async register(credentials: Credentials): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      const user = userCredential.user;

      // Criar documento do usuário no Firestore
      const userDoc = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDoc, {
        email: user.email,
        imageUrl: null,
        createdAt: new Date(),
      });

      // Enviar e-mail de verificação
      await sendEmailVerification(user);
      return user; // Retornar o usuário após registro
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return null;
    }
  }

  // Alterar a senha do usuário
  async changePassword(newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await firebaseUpdatePassword(user, newPassword);
    } else {
      throw new Error('Usuário não autenticado');
    }
  }

  // Enviar e-mail de redefinição de senha
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
      throw error;
    }
  }

  // Obter o estado do usuário
  getUser(): Observable<User | null> {
    return authState(this.auth);
  }

  // Obter ID do usuário logado
  getUserId(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  // Login com Google
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(this.auth, provider);
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
    }
  }

  // Login com e-mail e senha
  async login(credentials: Credentials): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await this.logout(); // Desconectar se o e-mail não estiver verificado
        throw new Error('Por favor, verifique seu e-mail antes de fazer login.');
      }

      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return null;
    }
  }

  // Logout do usuário
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  // Lidar com o resultado do redirecionamento após o login
  async handleRedirectResult(): Promise<User | null> {
    try {
      const result = await getRedirectResult(this.auth);
      return result?.user || null;
    } catch (error) {
      console.error('Erro ao recuperar o resultado do redirecionamento:', error);
      return null;
    }
  }
}
