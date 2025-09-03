import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthState } from './ngrx/auth/auth.state';
import { Store } from '@ngrx/store';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { clearAuth, storeAuth } from './ngrx/auth/auth.actions';
import { Observable } from 'rxjs';
import { AuthModel } from './models/auth.model';
import { MaterialModule } from './shared/material/material.module';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rzomie-fe';
  auth$!: Observable<AuthModel | null>;

  constructor(private store: Store<{ auth: AuthState }>, private auth: Auth, private route: Router) {
    this.auth$ = this.store.select('auth', "authInfo");
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const { email, displayName, photoURL } = user;
        this.store.dispatch(storeAuth(
          { 
            authInfo: { email: email!, name: displayName!, photoURL: photoURL! },
            token: token 
          }
        ))
      } else {
        this.store.dispatch(clearAuth());
      }
    })
  }
}
