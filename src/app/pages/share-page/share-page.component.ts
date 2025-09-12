import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { CvSectionState } from '../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';

import * as CvSectionActions from '../../ngrx/cv-section/cv-section.actions';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-share-page',
  imports: [MaterialModule, AsyncPipe , NgxSkeletonLoaderModule],
  templateUrl: './share-page.component.html',
  styleUrl: './share-page.component.scss',
})
export class SharePageComponent implements OnInit, OnDestroy {
  shareCvData$!: Observable<any | null>;
  subscription: Subscription[] = [];
  safeHtml!: SafeHtml;
  generatedCv$!: Observable<any>;
  isLoading$!: Observable<boolean>;

  constructor(
    private store: Store<{ cvSections: CvSectionState }>,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.generatedCv$ = this.store.select('cvSections', 'generatedCv');
    this.shareCvData$ = this.store.select(
      (state) => state.cvSections.shareCvData
    );
    this.isLoading$ = this.store.select('cvSections', 'isGettingShareCv');
  }

  ngOnInit(): void {
    this.subscription.push(
      this.shareCvData$.subscribe((data) => {
        if (data) {
          this.store.dispatch(
            CvSectionActions.generateCv({
              data: {
                data: data.cvData,
                cvTheme: data.cvTheme,
              },
            })
          );
        }
      }),

      this.generatedCv$.subscribe((data) => {
        if (data) {
          this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(data);
        }
      })
    );

    const { id } = this.activatedRoute.snapshot.params;
    this.store.dispatch(CvSectionActions.getShareCvById({ id: id }));
  }

  ngOnDestroy(): void {}
}
