import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { CvSectionState } from '../../../../../../ngrx/cv-section/cv-section.state';
import { Education } from '../../../../../../models/cv-block.model';
import { updateCvSection } from '../../../../../../ngrx/cv-section/cv-section.actions';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="education-section">
      <form class="education-form" [formGroup]="formGroup">
        <h4>Thông tin học vấn</h4>

        <div class="form-row">
          <mat-form-field class="example-full-width">
            <mat-label>Bằng cấp</mat-label>
            <input
              matInput
              formControlName="degree"
              placeholder="Ví dụ: Cử nhân, Thạc sĩ, Tiến sĩ"
            />
            <mat-icon matPrefix>school</mat-icon>
            @if (degreeFormControl.hasError('required')) {
            <mat-error>Bằng cấp là <strong>bắt buộc</strong></mat-error>
            }
          </mat-form-field>

          <mat-form-field class="example-full-width">
            <mat-label>Tên trường/cơ sở</mat-label>
            <input
              matInput
              formControlName="institution"
              placeholder="Nhập tên trường/cơ sở"
            />
            <mat-icon matPrefix>domain</mat-icon>
            @if (institutionFormControl.hasError('required')) {
            <mat-error>Tên trường/cơ sở là <strong>bắt buộc</strong></mat-error>
            }
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field class="example-full-width">
            <mat-label>Địa điểm</mat-label>
            <input
              matInput
              formControlName="location"
              placeholder="Thành phố, Quốc gia"
            />
            <mat-icon matPrefix>location_on</mat-icon>
          </mat-form-field>

          <mat-form-field class="example-full-width">
            <mat-label>GPA/Điểm số</mat-label>
            <input
              matInput
              formControlName="gpa"
              placeholder="Ví dụ: 3.8/4.0"
            />
            <mat-icon matPrefix>grade</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field class="example-full-width">
            <mat-label>Năm bắt đầu</mat-label>
            <input
              matInput
              [matDatepicker]="startPicker"
              formControlName="startDate"
              placeholder="Chọn năm bắt đầu"
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="startPicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #startPicker startView="year"></mat-datepicker>
            @if (startDateFormControl.hasError('required')) {
            <mat-error>Năm bắt đầu là <strong>bắt buộc</strong></mat-error>
            }
          </mat-form-field>

          <mat-form-field class="example-full-width">
            <mat-label>Năm kết thúc</mat-label>
            <input
              matInput
              [matDatepicker]="endPicker"
              formControlName="endDate"
              placeholder="Chọn năm kết thúc"
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="endPicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #endPicker startView="year"></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field class="example-full-width">
          <mat-label>Mô tả thêm</mat-label>
          <textarea
            matInput
            rows="4"
            formControlName="description"
            placeholder="Thành tích, hoạt động nổi bật, dự án học tập..."
          ></textarea>
          <mat-icon matPrefix>description</mat-icon>
        </mat-form-field>

        <div class="form-actions">
          <button mat-raised-button color="primary" (click)="updateSection()">
            Lưu thông tin
          </button>
          <button mat-stroked-button type="button" (click)="resetForm()">
            Đặt lại
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./section-forms.scss'],
})
export class EducationFormComponent {

  @Input() index!: number;
  // Form Controls
  degreeFormControl = new FormControl('', [Validators.required]);
  institutionFormControl = new FormControl('', [Validators.required]);
  locationFormControl = new FormControl('');
  gpaFormControl = new FormControl('');
  startDateFormControl = new FormControl('', [Validators.required]);
  endDateFormControl = new FormControl('');
  descriptionFormControl = new FormControl('');

  formGroup = new FormGroup({
    degree: this.degreeFormControl,
    institution: this.institutionFormControl,
    location: this.locationFormControl,
    gpa: this.gpaFormControl,
    startDate: this.startDateFormControl,
    endDate: this.endDateFormControl,
    description: this.descriptionFormControl
  });

  constructor(private store: Store<{ cvSections: CvSectionState}>) {
    
  }

  showData(): void {
    if (this.formGroup.valid) {
      const educationInfo: Education = this.formGroup.value as Education;
      console.log('Education Info Data:', educationInfo);
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.formGroup.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      control?.markAsTouched();
    });
  }

  updateSection(): void {
    if (this.formGroup.valid) {
      this.store.dispatch(updateCvSection({sectionType: 'education',data: this.formGroup.value}));
    } else {
      this.markFormGroupTouched();
    }
  }
}
