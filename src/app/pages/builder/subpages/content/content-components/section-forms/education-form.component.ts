import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CVSection } from '../../services/cv-sections.service';
import { CvSectionsDataService } from '../../services/cv-sections-data.service';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="education-section">
      <h4>Thông tin học vấn</h4>

      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Bằng cấp *</mat-label>
          <input
            matInput
            [value]="data?.degree || ''"
            placeholder="Ví dụ: Cử nhân, Thạc sĩ, Tiến sĩ"
            (input)="updateData('degree', $event)"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tên trường/cơ sở *</mat-label>
          <input
            matInput
            [value]="data?.institution || ''"
            (input)="updateData('institution', $event)"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Địa điểm</mat-label>
          <input
            matInput
            [value]="data?.location || ''"
            (input)="updateData('location', $event)"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>GPA/Điểm số</mat-label>
          <input
            matInput
            [value]="data?.gpa || ''"
            (input)="updateData('gpa', $event)"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Năm bắt đầu</mat-label>
          <input
            matInput
            [matDatepicker]="startPicker"
            [value]="data?.startDate || ''"
            (dateInput)="updateData('startDate', $event)"
          />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="startPicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #startPicker startView="year"></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Năm kết thúc</mat-label>
          <input
            matInput
            [matDatepicker]="endPicker"
            [value]="data?.endDate || ''"
            (dateInput)="updateData('endDate', $event)"
          />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="endPicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #endPicker startView="year"></mat-datepicker>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Mô tả thêm (tùy chọn)</mat-label>
        <textarea
          matInput
          rows="3"
          [value]="data?.description || ''"
          (input)="updateData('description', $event)"
          placeholder="Thành tích, hoạt động nổi bật, dự án học tập..."
        ></textarea>
      </mat-form-field>
    </div>
  `,
  styleUrls: ['./section-forms.scss'],
})
export class EducationFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  constructor(private cvSectionsDataService: CvSectionsDataService) {}

  updateData(field: string, event: Event | any): void {
    let value: any;
    if (event.target) {
      value = (event.target as HTMLInputElement).value;
    } else {
      value = event.value || event;
    }
    const updatedData = { ...this.data, [field]: value };
    this.dataChange.emit(updatedData);
    
    // Sử dụng section.instanceId để phân biệt các education sections
    this.cvSectionsDataService.updateSectionData(
      this.section.instanceId || this.section.id, 
      'education', 
      updatedData
    );
  }

  formatEducationData(): void {
    if (!this.data || Object.keys(this.data).length === 0) {
      console.error('❌ No education data to format');
      return;
    }

    const formattedEducation = {
      degree: this.data.degree || '',
      institution: this.data.institution || '',
      location: this.data.location || '',
      startDate: this.data.startDate || '',
      endDate: this.data.endDate || '',
      gpa: this.data.gpa || '',
      description: this.data.description || '',
    };
  }
}
