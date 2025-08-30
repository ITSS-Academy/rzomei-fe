import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CVSection } from '../../services/cv-sections.service';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <div class="experience-section">
      <h4>Kinh nghiệm làm việc</h4>
      
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Tên công ty *</mat-label>
          <input matInput [value]="data?.company || ''" (input)="updateData('company', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Vị trí công việc *</mat-label>
          <input matInput [value]="data?.position || ''" (input)="updateData('position', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Địa điểm</mat-label>
          <input matInput [value]="data?.location || ''" (input)="updateData('location', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Loại hình công việc</mat-label>
          <input matInput [value]="data?.employmentType || ''" placeholder="Full-time, Part-time, Contract..." (input)="updateData('employmentType', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ngày bắt đầu</mat-label>
          <input matInput [matDatepicker]="startPicker" [value]="data?.startDate || ''" (dateInput)="updateData('startDate', $event)">
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>

        <div class="date-checkbox-group">
          <mat-form-field appearance="outline" [class.disabled]="data?.isCurrentJob">
            <mat-label>Ngày kết thúc</mat-label>
            <input matInput [matDatepicker]="endPicker" [value]="data?.endDate || ''" 
                   [disabled]="data?.isCurrentJob" (dateInput)="updateData('endDate', $event)">
            <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
          <mat-checkbox [checked]="data?.isCurrentJob || false" (change)="updateData('isCurrentJob', $event.checked)">
            Hiện tại đang làm việc ở đây
          </mat-checkbox>
        </div>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Mô tả công việc và thành tích</mat-label>
        <textarea
          matInput
          rows="4"
          [value]="data?.description || ''"
          (input)="updateData('description', $event)"
          placeholder="Mô tả trách nhiệm, thành tích và kỹ năng đạt được trong công việc này..."
        ></textarea>
      </mat-form-field>
    </div>
  `,
  styleUrls: ['./section-forms.scss']
})
export class ExperienceFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  updateData(field: string, event: Event | any): void {
    let value: any;
    if (typeof event === 'boolean') {
      value = event;
    } else if (event.target) {
      value = (event.target as HTMLInputElement).value;
    } else {
      value = event.value || event;
    }
    
    const updatedData = { ...this.data, [field]: value };
    
    // Nếu đang làm việc hiện tại, xóa ngày kết thúc
    if (field === 'isCurrentJob' && value) {
      updatedData.endDate = null;
    }
    
    this.dataChange.emit(updatedData);
  }
}
