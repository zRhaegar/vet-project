import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { enableDebugTools } from '@angular/platform-browser';
import { ApplicationRef, NgModuleRef } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then((moduleRef: NgModuleRef<any>) => {
    if (!environment.production) {
      const applicationRef = moduleRef.injector.get(ApplicationRef);
      const componentRef = applicationRef.components[0];
      enableDebugTools(componentRef);
    }
    defineCustomElements(window);
  })
  .catch(err => console.error(err));