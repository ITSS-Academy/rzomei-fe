import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CVSection } from '../../services/cv-sections.service';

@Component({
  selector: 'app-personal-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="personal-info-section">
      <div class="upload-section">
        <h4>Ảnh Đại Diện</h4>
        <div class="upload-area">
          <div class="avatar-placeholder">
            <span>CV</span>
          </div>
          <div class="upload-controls">
            <button mat-stroked-button color="primary">
              <mat-icon>upload</mat-icon>
              Upload Image
            </button>
            <p class="upload-note">
              Supported: JPEG, PNG, JPG, WebP (Max 5MB)
            </p>
            <mat-form-field appearance="outline">
              <mat-label>Or paste image URL</mat-label>
              <input matInput placeholder="https://..." />
              <mat-icon matPrefix>link</mat-icon>
            </mat-form-field>
          </div>
        </div>
      </div>

      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Họ và Tên *</mat-label>
          <input matInput [value]="data?.fullName || ''" (input)="updateData('fullName', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Địa Chỉ Email *</mat-label>
          <input matInput type="email" [value]="data?.email || ''" (input)="updateData('email', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Số Điện Thoại</mat-label>
          <input matInput [value]="data?.phone || ''" (input)="updateData('phone', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Địa Chỉ</mat-label>
          <input matInput [value]="data?.address || ''" (input)="updateData('address', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Hồ Sơ LinkedIn</mat-label>
          <input matInput [value]="data?.linkedin || ''" (input)="updateData('linkedin', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Trang Web</mat-label>
          <input matInput [value]="data?.website || ''" (input)="updateData('website', $event)" />
        </mat-form-field>
      </div>
    </div>
  `,
  styleUrls: ['./section-forms.scss']
})
export class PersonalFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  updateData(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const updatedData = { ...this.data, [field]: value };
    this.dataChange.emit(updatedData);
  }
}
