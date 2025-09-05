import { Component, Input, Output, EventEmitter } from '@angular/core';
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
import { Experience } from '../../../../../../models/cv-block.model';
import { updateCvSection } from '../../../../../../ngrx/cv-section/cv-section.actions';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="experience-section">
      <form class="experience-form" [formGroup]="formGroup">
        <h4>Kinh nghiệm làm việc</h4>

        <div class="form-row">
          <mat-form-field class="example-full-width">
            <mat-label>Tên công ty</mat-label>
            <input
              matInput
              formControlName="company"
              placeholder="Nhập tên công ty"
            />
            <mat-icon matPrefix>business</mat-icon>
            @if (companyFormControl.hasError('required')) {
            <mat-error>Tên công ty là <strong>bắt buộc</strong></mat-error>
            }
          </mat-form-field>

          <mat-form-field class="example-full-width">
            <mat-label>Vị trí công việc</mat-label>
            <input
              matInput
              formControlName="position"
              placeholder="Nhập vị trí công việc"
            />
            <mat-icon matPrefix>work</mat-icon>
            @if (positionFormControl.hasError('required')) {
            <mat-error>Vị trí công việc là <strong>bắt buộc</strong></mat-error>
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

          <mat-checkbox
            formControlName="current"
            class="current-checkbox"
          >
            Hiện tại đang làm việc ở đây
          </mat-checkbox>
        </div>

        <div class="form-row">
          <mat-form-field class="example-full-width">
            <mat-label>Ngày bắt đầu</mat-label>
            <input
              matInput
              [matDatepicker]="startPicker"
              formControlName="startDate"
              placeholder="Chọn ngày bắt đầu"
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="startPicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #startPicker startView="year"></mat-datepicker>
            @if (startDateFormControl.hasError('required')) {
            <mat-error>Ngày bắt đầu là <strong>bắt buộc</strong></mat-error>
            }
          </mat-form-field>

          <mat-form-field class="example-full-width" [class.disabled]="!!formGroup.get('current')?.value">
            <mat-label>Ngày kết thúc</mat-label>
            <input
              matInput
              [matDatepicker]="endPicker"
              formControlName="endDate"
              [disabled]="!!formGroup.get('current')?.value"
              placeholder="Chọn ngày kết thúc"
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="endPicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #endPicker startView="year"></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field class="example-full-width">
          <mat-label>Mô tả công việc và thành tích</mat-label>
          <textarea
            matInput
            rows="4"
            formControlName="description"
            placeholder="Mô tả trách nhiệm, thành tích và kỹ năng đạt được trong công việc này..."
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
  styleUrls: ['./section-forms.scss']
})
export class ExperienceFormComponent {
  @Input() index!: number;
  @Output() dataChange = new EventEmitter<any>();
  
  // Form Controls
  companyFormControl = new FormControl('', [Validators.required]);
  positionFormControl = new FormControl('', [Validators.required]);
  locationFormControl = new FormControl('');
  startDateFormControl = new FormControl('', [Validators.required]);
  endDateFormControl = new FormControl('');
  currentFormControl = new FormControl(false);
  descriptionFormControl = new FormControl('');

  formGroup = new FormGroup({
    company: this.companyFormControl,
    position: this.positionFormControl,
    location: this.locationFormControl,
    startDate: this.startDateFormControl,
    endDate: this.endDateFormControl,
    current: this.currentFormControl,
    description: this.descriptionFormControl
  });

  constructor(private store: Store<{ cvSections: CvSectionState}>) {
    // Watch for changes in current checkbox to handle endDate
    this.currentFormControl.valueChanges.subscribe(current => {
      if (current) {
        this.endDateFormControl.setValue('Present');
        this.endDateFormControl.disable();
      } else {
        this.endDateFormControl.enable();
        if (this.endDateFormControl.value === 'Present') {
          this.endDateFormControl.setValue('');
        }
      }
    });
  }

  showData(): void {
    if (this.formGroup.valid) {
      const experienceInfo: Experience = this.formGroup.value as Experience;
      console.log('Experience Info Data:', experienceInfo);
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
      this.store.dispatch(updateCvSection({sectionType: 'experience', data: this.formGroup.value}));
    } else {
      this.markFormGroupTouched();
    }
  }
}
