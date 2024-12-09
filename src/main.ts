import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()), // Provide the router with your app's routes
    importProvidersFrom(HttpClientModule),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    {provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig},
    provideDatabase(() => getDatabase()), provideAnimationsAsync(),
    importProvidersFrom(
      NgxLoadingModule.forRoot({
        animationType: ngxLoadingAnimationTypes.doubleBounce,
        backdropBackgroundColour: 'rgba(0,0,0,0.5)',
        backdropBorderRadius: '4px',
        primaryColour: '#ffffff',
        secondaryColour: '#ffffff',
        tertiaryColour: '#ffffff',
        fullScreenBackdrop: false,
      })
    ),
    provideAnimations(), // required animations providers
    provideToastr(),
  ]
})  // Bootstrap the standalone component
  .catch(err => console.error(err));

