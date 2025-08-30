import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CVSection } from '../../services/cv-sections.service';

@Component({
  selector: 'app-languages-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="languages-section">
      <h4>Ngôn ngữ</h4>
      
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Ngôn ngữ</mat-label>
          <input matInput [value]="data?.language || ''" (input)="updateData('language', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Trình độ</mat-label>
          <mat-select [value]="data?.level || ''" (selectionChange)="updateData('level', $event.value)">
            <mat-option value="beginner">Mới bắt đầu</mat-option>
            <mat-option value="elementary">Sơ cấp</mat-option>
            <mat-option value="intermediate">Trung cấp</mat-option>
            <mat-option value="advanced">Nâng cao</mat-option>
            <mat-option value="fluent">Thành thạo</mat-option>
            <mat-option value="native">Bản địa</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Chứng chỉ (tùy chọn)</mat-label>
          <input matInput [value]="data?.certificate || ''" placeholder="TOEFL, IELTS, TOEIC..." (input)="updateData('certificate', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Điểm số (tùy chọn)</mat-label>
          <input matInput [value]="data?.score || ''" placeholder="7.5, 800..." (input)="updateData('score', $event)" />
        </mat-form-field>
      </div>
    </div>
  `,
  styleUrls: ['./section-forms.scss']
})
export class LanguagesFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  updateData(field: string, event: Event | any): void {
    let value: any;
    if (typeof event === 'string') {
      value = event;
    } else if (event.target) {
      value = (event.target as HTMLInputElement).value;
    } else {
      value = event.value || event;
    }
    const updatedData = { ...this.data, [field]: value };
    this.dataChange.emit(updatedData);
  }
}
