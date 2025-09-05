import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Project } from '../../../../../../models/cv-block.model';

@Component({
  selector: 'app-projects-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="projects-section">
      <h4>Dự án</h4>
      
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Tên dự án *</mat-label>
          <input matInput [value]="data?.title || ''" (input)="updateData('title', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Công nghệ sử dụng</mat-label>
          <input matInput [value]="data?.technologies ? data.technologies.join(', ') : ''" 
                 (input)="updateTechnologies($event)" 
                 placeholder="React, Node.js, MongoDB (phân cách bằng dấu phẩy)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Link dự án</mat-label>
          <input matInput [value]="data?.url || ''" placeholder="https://..." (input)="updateData('url', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Link GitHub</mat-label>
          <input matInput [value]="data?.github || ''" placeholder="https://github.com/..." (input)="updateData('github', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ngày bắt đầu</mat-label>
          <input matInput [matDatepicker]="startPicker" [value]="data?.startDate || ''" (dateInput)="updateData('startDate', $event)">
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ngày kết thúc</mat-label>
          <input matInput [matDatepicker]="endPicker" [value]="data?.endDate || ''" (dateInput)="updateData('endDate', $event)">
          <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Mô tả dự án</mat-label>
        <textarea
          matInput
          rows="4"
          [value]="data?.description || ''"
          (input)="updateData('description', $event)"
          placeholder="Mô tả tính năng, thách thức và kết quả đạt được..."
        ></textarea>
      </mat-form-field>
    </div>
  `,
  styleUrls: ['./section-forms.scss']
})
export class ProjectsFormComponent {
  @Input() section!: Project;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  constructor() {}

  updateTechnologies(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const technologies = value.split(',').map(tech => tech.trim()).filter(tech => tech);
    const updatedData = { ...this.data, technologies };
    this.dataChange.emit(updatedData);
  
  }

  updateData(field: string, event: Event | any): void {
    let value: any;
    if (event.target) {
      value = (event.target as HTMLInputElement).value;
    } else {
      value = event.value || event;
    }
    const updatedData = { ...this.data, [field]: value };
    this.dataChange.emit(updatedData);
  }
}
