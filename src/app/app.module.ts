import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';  // Mantenha o FIREBASE_OPTIONS aqui
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase initialization (manual)
import { initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFirebaseApp } from '@angular/fire/app';

import { environment } from '../environments/environment';  // Certifique-se de que o environment esteja correto

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Alterando aqui para usar `environment.firebase`
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },  // Alterar para `firebase`
    provideFirebaseApp(() => initializeApp({
      projectId: "vet-project-f01f4",
      appId: "1:865468859560:web:4cfd0065d322c0d3d3ae9d",
      storageBucket: "vet-project-f01f4.appspot.com",
      apiKey: "AIzaSyD_IytOHsWSqW0JVDW26eRZXlicVmLJk1Q",
      authDomain: "vet-project-f01f4.firebaseapp.com",
      messagingSenderId: "865468859560",
      measurementId: "G-DPS00EZWGX"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
