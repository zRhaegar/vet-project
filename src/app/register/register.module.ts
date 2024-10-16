import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Adicione ReactiveFormsModule aqui
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './register.page';
import { RegisterPageRoutingModule } from './register-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Não se esqueça de importar aqui
    IonicModule,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule { }
