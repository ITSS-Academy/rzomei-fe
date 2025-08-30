import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CVSection } from '../../services/cv-sections.service';

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
          <input matInput [value]="data?.name || ''" (input)="updateData('name', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Vai trò</mat-label>
          <input matInput [value]="data?.role || ''" (input)="updateData('role', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Công nghệ sử dụng</mat-label>
          <input matInput [value]="data?.technologies || ''" placeholder="React, Node.js, MongoDB..." (input)="updateData('technologies', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Link dự án</mat-label>
          <input matInput [value]="data?.link || ''" placeholder="https://..." (input)="updateData('link', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Link GitHub</mat-label>
          <input matInput [value]="data?.github || ''" placeholder="https://github.com/..." (input)="updateData('github', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Thời gian hoàn thành</mat-label>
          <input matInput [matDatepicker]="datePicker" [value]="data?.completedDate || ''" (dateInput)="updateData('completedDate', $event)">
          <mat-datepicker-toggle matIconSuffix [for]="datePicker"></mat-datepicker-toggle>
          <mat-datepicker #datePicker></mat-datepicker>
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
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

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
