import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AuthState } from '../../ngrx/auth/auth.state';
import { Store } from '@ngrx/store';

import { login } from '../../ngrx/auth/auth.actions';
import { clearAuth } from '../../ngrx/auth/auth.actions';

@Component({
  selector: 'app-login',
  imports: [MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  loginSuccess$!: Observable<boolean>;
  loginError$!: Observable<string | null>;

  constructor(private store: Store<{auth: AuthState}>) {
    this.loginSuccess$ = this.store.select('auth', 'loginSuccess');
    this.loginError$ = this.store.select('auth', 'error');

    this.loginSuccess$.subscribe((success) => {
      if (success) {
        console.log("Login successful");
      }
    })

    this.loginError$.subscribe((error) => {
      if (error) {
        console.log("Login failure");
      }
    })

  }


  login(){
    this.store.dispatch(login());
  }

  logout(){
    this.store.dispatch(clearAuth());
  }
}
