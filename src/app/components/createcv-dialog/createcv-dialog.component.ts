import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PreviewCvComponent } from '../preview-cv/preview-cv.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AuthState } from '../../ngrx/auth/auth.state';
import { CvSectionState } from '../../ngrx/cv-section/cv-section.state';
import { Observable, Subscription } from 'rxjs';
import * as CvSectionActions from '../../ngrx/cv-section/cv-section.actions';
import { AsyncPipe } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@Component({
  selector: 'app-createcv-dialog',
  imports: [
    MaterialModule,
    SlickCarouselModule,
    AsyncPipe,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './createcv-dialog.component.html',
  styleUrl: './createcv-dialog.component.scss',
})
export class CreatecvDialogComponent implements OnInit, OnDestroy {
  baseCVThemes$!: Observable<any[] | null>;
  createSuccess$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;
  token$!: Observable<string | null>;
  subscriptions: Subscription[] = [];

  selectedThemeIndex = 0;

  constructor(
    private dialog: MatDialog,
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>
  ) {
    this.createSuccess$ = this.store.select(
      (state) => state.cvSections.createSuccess
    );
    this.baseCVThemes$ = this.store.select('cvSections', 'baseThemes');
    this.token$ = this.store.select('auth', 'token');
    this.isLoading$ = this.store.select('cvSections', 'isGetBaseThemesLoading');
  }

  openThemeDialog(theme: any) {
    this.dialog.open(PreviewCvComponent, {
      data: theme,
      width: 'fit-content',
      maxWidth: 'none',
      maxHeight: 'none',
      height: 'fit-content',
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.token$.subscribe((token) => {
        if (token) {
          this.store.dispatch(CvSectionActions.getBaseCVThemes());
        }
      }),

      this.createSuccess$.subscribe((success) => {
        if (success) {
          console.log(success);
          this.dialog.closeAll();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
