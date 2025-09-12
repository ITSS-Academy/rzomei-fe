import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AuthState } from '../../../../ngrx/auth/auth.state';
import { CvSectionState } from '../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as CvSectionActions from '../../../../ngrx/cv-section/cv-section.actions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-delete-cv-dialog',
  imports: [MaterialModule, AsyncPipe],
  templateUrl: './delete-cv-dialog.component.html',
  styleUrl: './delete-cv-dialog.component.scss',
})
export class DeleteCvDialogComponent implements OnInit, OnDestroy {
  isDeletingCv$!: Observable<boolean>;
  deleteSuccess$!: Observable<boolean>;
  token$!: Observable<string | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<DeleteCvDialogComponent>,
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.token$ = this.store.select('auth', 'token');
    this.isDeletingCv$ = this.store.select(
      (state) => state.cvSections.isDeletingCv
    );
    this.deleteSuccess$ = this.store.select(
      (state) => state.cvSections.deleteSuccess
    );
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.deleteSuccess$.subscribe((success) => {
        if (success) {
          this.store.dispatch(CvSectionActions.getAllCvs());
          this.dialogRef.close(true); // Đóng dialog và trả về true nếu xóa thành công
        }
      })
    );
  }

  onDelete() {
    console.log('Delete CV id:', this.data.cvId);
    this.store.dispatch(CvSectionActions.deleteCvById({ id: this.data.cvId }));
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
