import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../ngrx/auth/auth.state';
import { CvSectionState } from '../../ngrx/cv-section/cv-section.state';

import * as CvSectionActions from '../../ngrx/cv-section/cv-section.actions';
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
    MatSnackBarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  id = '';
  AllCvs$!: Observable<any[] | null>;
  currentCv$!: Observable<any | null>;
  isExporting$!: Observable<boolean>;
  cvBlob$!: Observable<any>;
  currentCv: any;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>,
    private snackBar: MatSnackBar
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
    this.currentCv$ = this.store.select('cvSections', 'generatedCv');
    this.isExporting$ = this.store.select('cvSections', 'isExporting');
    this.cvBlob$ = this.store.select('cvSections', 'cvBlob');
  }
  ngOnInit(): void {

    this.cvBlob$.subscribe((blob) => {
      console.log(blob);
      if (blob) {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        // get current date time
        const now = new Date();
        const dateString = now.toISOString().slice(0, 19).replace(/:/g, "-");
        a.href = url;
        a.download = `Rzomei_CV_${dateString}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.store.dispatch(CvSectionActions.clearCvBlob());
      }
    })

      this.subscriptions.push(
        this.isExporting$.subscribe((exporting) => {
          if (exporting) {
            // use material snackbar to show exporting message
            this.snackBar.open('Đang tải CV xuống', 'Đóng', {
              duration: 0, // không tự đóng
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['info-snackbar']
            });
          } else {
            this.snackBar.dismiss();
          }
        })
      ),
      this.currentCv$.subscribe((cv) => {
        if (cv) {
          this.currentCv = cv;
        }
      })
  }

  exportCv(): void {
    if (this.currentCv) {
      this.store.dispatch(CvSectionActions.exportCv({
        data: {
          html: this.currentCv
        }
      }));
    }
  }


  copyLinkToShareCv(): void {
    const shareableLink = `${window.location.origin}/share/${this.id}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      this.snackBar.open('Đã sao chép link chia sẻ vào clipboard', 'Đóng', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['info-snackbar']
      });
    });
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
