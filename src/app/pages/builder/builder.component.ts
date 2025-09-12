import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material/material.module';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CvSectionState } from '../../ngrx/cv-section/cv-section.state';
import { AsyncPipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClientAuth } from '../../utils/http-client-auth';
import { AuthState } from '../../ngrx/auth/auth.state';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

import * as CvSectionActions from '../../ngrx/cv-section/cv-section.actions';

@Component({
  selector: 'app-builder',
  imports: [
    NavbarComponent,
    RouterModule,
    MaterialModule,
    AsyncPipe,
    NgxSkeletonLoaderComponent,
  ],
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent {
  generatedCv$!: Observable<any>;
  subscription: Subscription[] = [];
  safeHtml!: SafeHtml;
  constructor(
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) {
    this.generatedCv$ = this.store.select('cvSections', 'generatedCv');
    this.section$ = this.store.select((state) => state.cvSections.sections);
    this.token$ = this.store.select((state) => state.auth.token);
  }

  section$!: Observable<any>;
  token$!: Observable<string | null>;

  ngOnInit(): void {
    this.subscription.push(
      this.token$.subscribe((token) => {
        const { id } = this.activatedRoute.snapshot.params;
        if (token) {
          this.store.dispatch(CvSectionActions.getCvById({ id: id }));
        }
      }),
      this.generatedCv$.subscribe((data) => {
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(data);
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions or resources here
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
