import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PetCardPageRoutingModule } from './pet-card-routing.module';
import { PetCardPage } from './pet-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetCardPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PetCardPage]
})
export class PetCardModule {}