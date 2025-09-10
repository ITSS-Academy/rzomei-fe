import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../ngrx/auth/auth.state';
import { CvSectionState } from '../../ngrx/cv-section/cv-section.state';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  id = '';
  AllCvs$!: Observable<any[] | null>;

  constructor(
    private router: Router,
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>
  ) {
    // Initialize id from current URL
    const urlParts = this.router.url.split('/');
    if (urlParts[1] === 'builder' && urlParts[2]) {
      this.id = urlParts[2];
    }
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const urlParts = event.url.split('/');
        if (urlParts[1] === 'builder' && urlParts[2]) {
          this.id = urlParts[2];
        }
      }
    });
    this.AllCvs$ = this.store.select('cvSections', 'allCvs');
  }
}
