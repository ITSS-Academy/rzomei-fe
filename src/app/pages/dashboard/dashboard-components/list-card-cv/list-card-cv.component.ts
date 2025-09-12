import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Router } from '@angular/router';
import { DeleteCvDialogComponent } from '../delete-cv-dialog/delete-cv-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-card-cv',
  imports: [MaterialModule, CommonModule],
  templateUrl: './list-card-cv.component.html',
  styleUrl: './list-card-cv.component.scss',
})
export class ListCardCvComponent {
  @Input() cvId = '';
  @Input() title = '';
  @Input() template = '';
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() createdAt = '';
  @Input() updatedAt = '';
  @Input() imageUrl = '';

  constructor(private router: Router, private dialog: MatDialog) {}

  onEdit() {
    this.router.navigate(['/builder', this.cvId, 'content']);
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeleteCvDialogComponent, {
      data: {
        cvId: this.cvId,
        title: 'Xóa CV',
        message: 'Bạn có chắc muốn xóa CV này?',
        // confirmText: 'Xóa',
        // cancelText: 'Hủy',
      },
      autoFocus: false,
    });
  }
}
