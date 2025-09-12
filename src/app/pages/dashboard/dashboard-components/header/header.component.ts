import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Observable } from 'rxjs';
import { AuthModel } from '../../../../models/auth.model';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../ngrx/auth/auth.state';
import { clearAuth } from '../../../../ngrx/auth/auth.actions';
import { AsyncPipe } from '@angular/common';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  currentUser$: Observable<AuthModel | null>;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {
    this.currentUser$ = this.store.select((state) => state.auth.authInfo);
    this.currentUser$.subscribe((user) => {});
  }

  logout() {
    this.store.dispatch(clearAuth());
    //redirect to login page
    this.router.navigate(['/login']);
  }
}
