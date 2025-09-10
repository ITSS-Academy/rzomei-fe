import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './dashboard-components/header/header.component';
import { CardCvComponent } from './dashboard-components/card-cv/card-cv.component';
import { ListCardCvComponent } from './dashboard-components/list-card-cv/list-card-cv.component';
import { CvSectionState } from '../../ngrx/cv-section/cv-section.state';
import { AuthState } from '../../ngrx/auth/auth.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import * as CvSectionActions from '../../ngrx/cv-section/cv-section.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MaterialModule,
    HeaderComponent,
    CardCvComponent,
    ListCardCvComponent,
    FormsModule,
    RouterLink,
    NgxSkeletonLoaderModule
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  viewMode: 'grid' | 'list' = 'grid';
  AllCvs$!: Observable<any[] | null>;
  authState$!: Observable<string | null>;
  isLoading$!: Observable<boolean>;

  constructor(
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>
  ) {
    this.AllCvs$ = this.store.select('cvSections', 'allCvs');
    this.authState$ = this.store.select('auth', 'token');
    this.isLoading$ = this.store.select('cvSections', 'isGetAllCvsLoading');
  }

  ngOnInit(): void {
    this.authState$.subscribe((token) => {
      if (token) {
        this.store.dispatch(CvSectionActions.getAllCvs());
      }
    });
  }

  ngOnDestroy(): void {}
}
