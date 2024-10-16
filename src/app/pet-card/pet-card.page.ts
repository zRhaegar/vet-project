import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetService, Pet } from '../services/pet.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pet-card',
  templateUrl: './pet-card.page.html',
  styleUrls: ['./pet-card.page.scss'],
})
export class PetCardPage implements OnInit {
  pets: Pet[] = [];
  petForm: FormGroup;
  isEditing: boolean = false;
  editingPetId: string | undefined;
  ownerName: string = '';
  userId: string | null = null;
  imageUrl: string | null = null; // Para armazenar a URL da imagem do pet

  constructor(
    private formBuilder: FormBuilder,
    private petService: PetService,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private storage: AngularFireStorage // Injeção do serviço de Storage
  ) {
    this.petForm = this.formBuilder.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      idNumber: [''],
      photoUrl: [''] // Campo para armazenar a URL da foto
    });
  }

  ngOnInit() {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.userId = user.uid;
          this.ownerName = user.displayName || 'Usuário';
          return this.petService.getPets(user.uid);
        } else {
          return of([]);
        }
      })
    ).subscribe({
      next: (pets) => {
        this.pets = pets;
        console.log(this.pets); // Verifica se os pets estão sendo carregados
      },
      error: (err) => {
        console.error('Erro ao carregar pets:', err);
      }
    });
  }

  startEditing(pet: Pet) {
    this.isEditing = true;
    this.editingPetId = pet.id;
    this.imageUrl = pet.photoUrl || null; // Armazena a URL da imagem existente, se houver
    this.petForm.patchValue({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      dateOfBirth: pet.dateOfBirth,
      idNumber: pet.idNumber,
      photoUrl: pet.photoUrl // Preenche o campo da URL da foto
    });
  }

  cancelEditing() {
    this.isEditing = false;
    this.editingPetId = undefined;
    this.imageUrl = null; // Reseta a URL da imagem
    this.petForm.reset();
  }

  // Função para fazer o upload da imagem
  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `pets/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.imageUrl = url;
            this.petForm.patchValue({ photoUrl: url });
            console.log('Imagem carregada com sucesso:', url); // Verifica se esta linha é atingida
          });
        })
      ).subscribe({
        error: (error) => {
          console.error('Erro ao fazer upload da imagem:', error);
        }
      });
    }
  }

  async onSubmit() {
    if (this.petForm.valid && this.userId) {
      const petData: Pet = this.petForm.value;
      petData.photoUrl = this.imageUrl; // Adiciona a URL da foto ao pet

      try {
        if (this.editingPetId) {
          await this.petService.updatePet(this.userId, this.editingPetId, petData);
          console.log('Pet atualizado com sucesso');
        } else {
          await this.petService.addPet(this.userId, petData);
          console.log('Pet adicionado com sucesso');
        }
        this.cancelEditing();
      } catch (error) {
        console.error('Erro ao salvar pet:', error);
        this.showAlert('Erro', 'Ocorreu um erro ao salvar o pet. Por favor, tente novamente.');
      }
    }
  }

  addNewPet() {
    this.isEditing = true;
    this.editingPetId = undefined;
    this.petForm.reset();
    this.imageUrl = null; // Reseta a URL da imagem para novo pet
  }

  async deletePet(petId: string | undefined) {
    if (this.userId && petId) {
      const alert = await this.alertController.create({
        header: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir este pet?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Excluir',
            handler: async () => {
              try {
                await this.petService.deletePet(this.userId!, petId);
                console.log('Pet excluído com sucesso');
                this.pets = this.pets.filter(p => p.id !== petId); // Remove o pet da lista
              } catch (error) {
                console.error('Erro ao excluir pet:', error);
                this.showAlert('Erro', 'Ocorreu um erro ao excluir o pet. Por favor, tente novamente.');
              }
            }
          }
        ]
      });
      await alert.present();
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
