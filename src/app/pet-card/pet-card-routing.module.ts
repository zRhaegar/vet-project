import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PetCardPage } from './pet-card.page';

const routes: Routes = [
  {
    path: '',
    component: PetCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetCardPageRoutingModule {}