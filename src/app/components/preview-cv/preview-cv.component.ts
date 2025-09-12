import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { Location } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NameCvDialogComponent } from '../name-cv-dialog/name-cv-dialog.component';
import { AuthState } from '../../ngrx/auth/auth.state';
import { CvSectionState } from '../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as CvSectionActions from '../../ngrx/cv-section/cv-section.actions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preview-cv',
  imports: [MaterialModule, FormsModule],
  templateUrl: './preview-cv.component.html',
  styleUrl: './preview-cv.component.scss',
})
export class PreviewCvComponent implements OnInit, OnDestroy {
  token$!: Observable<string | null>;
  isCreatingNewCv$!: Observable<boolean>;
  createSuccess$!: Observable<boolean>;
  subscriptions: Subscription[] = [];
  cvName = '';
  constructor(
    private dialogRef: MatDialogRef<PreviewCvComponent>,
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any // <-- nhận data ở đây
  ) {
    this.createSuccess$ = this.store.select((state) => state.cvSections.createSuccess);
    this.token$ = this.store.select((state) => state.auth.token);
    this.isCreatingNewCv$ = this.store.select(
      (state) => state.cvSections.isCreatingNewCv
    );
  }

  createNewCv() {
    this.token$.subscribe((token) => {
      if (token) {
        this.store.dispatch(
          CvSectionActions.createNewCv({
            data: { cvTheme: this.data.theme_name, cvName: this.cvName },
          })
        );
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openNameCvDialog() {
    const dialogRef = this.dialog.open(NameCvDialogComponent, {
      width: '400px',
      data: {
        /* truyền dữ liệu nếu cần */
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Xử lý tên CV được nhập ở đây
        console.log('Tên CV:', result);
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
