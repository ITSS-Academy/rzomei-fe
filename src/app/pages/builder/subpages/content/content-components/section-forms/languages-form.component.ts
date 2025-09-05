import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Language } from '../../../../../../models/cv-block.model';

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
            <mat-option value="Native/Bilingual">Bản ngữ</mat-option>
            <mat-option value="Fluent">Thành thạo</mat-option>
            <mat-option value="Conversation">Giao tiếp</mat-option>
            <mat-option value="Elementary">Sơ cấp</mat-option>
            <mat-option value="Beginner">Mới bắt đầu</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Chứng chỉ (tùy chọn)</mat-label>
          <input matInput [value]="data?.certification || ''" placeholder="TOEFL, IELTS, TOEIC..." (input)="updateData('certification', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Điểm số (tùy chọn)</mat-label>
          <input matInput [value]="data?.score || ''" placeholder="7.5, 800..." (input)="updateData('score', $event)" />
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Mô tả (tùy chọn)</mat-label>
        <textarea
          matInput
          rows="2"
          [value]="data?.description || ''"
          (input)="updateData('description', $event)"
          placeholder="Mô tả về khả năng sử dụng ngôn ngữ..."
        ></textarea>
      </mat-form-field>
    </div>
  `,
  styleUrls: ['./section-forms.scss']
})
export class LanguagesFormComponent {
  @Input() section!: Language;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  constructor() {}

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
