import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

interface UserProfile {
  id?: string;
  email: string;
  imageUrl?: string | null;
  createdAt?: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  profile: UserProfile | null = null;
  user$: Observable<User | null>; // Declare a propriedade user$

  constructor(
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loadUserProfile();
    this.user$ = this.authService.getUser(); // Inicialize a user$ com o método do AuthService
  }

  private loadUserProfile() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.avatarService.getUserProfile()
          .then((data: UserProfile | null) => {
            console.log('Perfil carregado:', data);
            this.profile = data;
          })
          .catch((err: unknown) => {
            console.error('Erro ao carregar o perfil do usuário:', err);
            this.profile = null;
          });
      } else {
        console.log('Nenhum usuário logado.');
        this.profile = null;
      }
    });
  }
  

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true })
    setTimeout(() => {
    }, 2000);;
  }

  async changeImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      if (image) {
        const loading = await this.loadingController.create();
        await loading.present();

        const result = await this.avatarService.uploadImage(image);
        if (!result) {
          throw new Error('Upload failed');
        }

        this.loadUserProfile();
      }
    } catch (error: any) {
      const errorMessage = (error instanceof Error) ? error.message : 'There was a problem uploading your avatar.';
      const alert = await this.alertController.create({
        header: 'Upload failed',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  handleRefresh(event: CustomEvent) {
    console.log('Refresh acionado!');
    const refresher = event.target as HTMLIonRefresherElement;

    setTimeout(() => {
      refresher.complete();
      this.loadUserProfile();
    }, 2000);
  }
  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.loadUserProfile(); // Chame o método aqui quando o usuário logar
      }
    });
  }
  
}
