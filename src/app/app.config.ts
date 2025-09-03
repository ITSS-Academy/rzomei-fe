import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { cvSectionReducer } from './ngrx/cv-section/cv-section.reducer';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


// Reducers
import { authReducer } from './ngrx/auth/auth.reducer';

//Effects
import * as AuthEffects from './ngrx/auth/auth.effects';
import { HttpClientAuth } from './utils/http-client-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),


    HttpClientAuth,

    provideFirebaseApp(() => initializeApp({ projectId: "rzomie-4d56b", appId: "1:1066506289495:web:b472905faf07e84b72be12", storageBucket: "rzomie-4d56b.firebasestorage.app", apiKey: "AIzaSyB19jeacZpC8hVo89cATGgEwQJ7ZWxbhKY", authDomain: "rzomie-4d56b.firebaseapp.com", messagingSenderId: "1066506289495" })), provideAuth(() => getAuth()),

    provideStore({
      auth: authReducer,
      cvSections: cvSectionReducer,
    }),
    provideEffects(
      AuthEffects
    ),
  ],
};
