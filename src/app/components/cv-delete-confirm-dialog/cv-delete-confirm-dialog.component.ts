import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cv-delete-confirm-dialog',
  imports: [MaterialModule],
  templateUrl: './cv-delete-confirm-dialog.component.html',
  styleUrl: './cv-delete-confirm-dialog.component.scss',
})
export class CvDeleteConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<CvDeleteConfirmDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
