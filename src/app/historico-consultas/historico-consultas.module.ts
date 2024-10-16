import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HistoricoConsultasPage } from './historico-consultas.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: HistoricoConsultasPage }])
  ],
  declarations: [HistoricoConsultasPage]
})
export class HistoricoConsultasPageModule {}